const { Op } = require("sequelize");
const { MoleculerError } = require("moleculer").Errors;

const Database = require("../../../adapters/Database");
const {
  ACTIVE,
  DELETE,
  DEFAULT_CURRENCY,
} = require("../../../plugin/constants");
const CodeTypes = require("../../../fixtures/error.codes");

const Currency = new Database("Dcurrency");
const CurrencyConversion = new Database("Dcurrencyconversion");

module.exports = {
  create: function (ctx) {
    try {
      return insertCurrency(this, ctx);
    } catch (err) {
      console.error("error in currency controller create function: \n", err);
      throw err;
    }
  },
  getAll: function (ctx) {
    try {
      const condition = { status: { [Op.ne]: DELETE } };
      return fetchAll(this, ctx, condition);
    } catch (err) {
      console.error("error in currency controller getAll function: \n", err);
      return this.requestError("Error has occured", err);
    }
  },
  getAllActive: function (ctx) {
    try {
      const condition = { status: ACTIVE };
      return fetchAll(this, ctx, condition);
    } catch (err) {
      console.error("error in currency controller getAllActive function: \n", err);
      return this.requestError("Error has occured", err);
    }
  },
  createConversion: function (ctx) {
    try {
      return insertConversion(this, ctx);
    } catch (err) {
      console.error(
        "error in currency controller create conversion function: \n",
        err
      );
      throw err;
    }
  },
  getAllConversions: function (ctx) {
    try {
      const condition = { status: { [Op.ne]: DELETE } };
      return fetchAllActiveConversions(this, ctx, condition);
    } catch (err) {
      console.error(
        "error in currency controller getAll conversions function: \n",
        err
      );
      return this.requestError("Error has occured", err);
    }
  },
  getConversion: function (ctx) {
    try {
      const condition = { status: ACTIVE, to: ctx.params.code };
      return fetchAllActiveConversions(this, ctx, condition);
    } catch (err) {
      console.error(
        "error in currency controller getConversion function: \n",
        err
      );
      return this.requestError("Error has occured", err);
    }
  },
  update: function (ctx) {
    try {
      const isCurrencyAllowedToUpdate = () =>
        ctx.params.code !== DEFAULT_CURRENCY;
      if (isCurrencyAllowedToUpdate()) {
        return validateCurrency(ctx)
          .then(() => {
            return updateCurrency(this, ctx);
          })
          .catch((err) => {
            return this.requestError(err);
          });
      } else {
        return this.requestError(
          "Default Currency SAR is not allowed to update."
        );
      }
    } catch (err) {
      console.error(
        "error in currency controller removeCurrency function: \n",
        err
      );
      return this.requestError("Error has occured", err);
    }
  },
  updateConversion: function (ctx) {
    try {
      return validateCurrencyConversion(ctx)
        .then(() => {
          return updateCurrencyConversion(this, ctx);
        })
        .catch((err) => {
          return this.requestError(err);
        });
    } catch (err) {
      console.error(
        "error in currency controller removeCurrency function: \n",
        err
      );
      return this.requestError("Error has occured", err);
    }
  },
  updateStatus: function (ctx) {
    try {
      const isCurrencyAllowedToUpdate = () =>
        ctx.params.code !== DEFAULT_CURRENCY;
      if (isCurrencyAllowedToUpdate()) {
        return updateCurrencyStatusWithConversion(this, ctx, ctx.params.status);
      } else {
        return this.requestError(
          "Default Currency SAR is not allowed to update."
        );
      }
    } catch (err) {
      console.error(
        "error in currency controller updateStatus function: \n",
        err
      );
      return this.requestError("Error has occured", err);
    }
  },
};

function validateCurrency(ctx) {
  return new Promise((resolve, reject) =>
    Currency.find(ctx, {
      query: { id: ctx.params.id, status: { [Op.ne]: DELETE } },
    })
      .then(() => resolve())
      .catch((err) => {
        if (err.name === "Nothing Found") reject(CodeTypes.NOTHING_FOUND);
        else reject(CodeTypes.UNKOWN_ERROR);
      })
  );
}

function updateCurrency(self, ctx) {
  return Currency.updateBy(
    ctx,
    ctx.meta.user.id,
    {
      code: ctx.params.code,
      name: ctx.params.name,
      symbol: ctx.params.symbol,
    },
    {
      query: {
        id: ctx.params.id,
      },
    }
  )
    .then((res) => {
      console.log("res---", res);
      return self.requestSuccess(
        `Requested Currency updated Successfully`,
        res
      );
    })
    .catch((err) => {
      if (err instanceof MoleculerError) return Promise.reject(err);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}

function validateCurrencyConversion(ctx) {
  return new Promise((resolve, reject) =>
    CurrencyConversion.find(ctx, {
      query: { id: ctx.params.id, status: { [Op.ne]: DELETE } },
    })
      .then(() => resolve())
      .catch((err) => {
        if (err.name === "Nothing Found") reject(CodeTypes.NOTHING_FOUND);
        else reject(CodeTypes.UNKOWN_ERROR);
      })
  );
}

function updateCurrencyConversion(self, ctx) {
  return CurrencyConversion.updateBy(
    ctx,
    ctx.params.id,
    {
      from: ctx.params.from,
      to: ctx.params.to,
      equalto: ctx.params.equalto,
    },
    {
      query: {
        id: ctx.params.id,
      },
    }
  )
    .then((res) => {
      return self.requestSuccess(
        `Requested Currency Conversion updated Successfully`,
        res
      );
    })
    .catch((err) => {
      if (err instanceof MoleculerError) return Promise.reject(err);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}

function updateCurrencyStatusWithConversion(self, ctx, status) {
  return Currency.updateBy(
    ctx,
    ctx.meta.user.id,
    {
      status,
    },
    {
      query: {
        code: ctx.params.code,
      },
    }
  )
    .then((res) => {
      return CurrencyConversion.updateBy(
        ctx,
        ctx.meta.user.id,
        {
          status,
        },
        {
          query: {
            to: ctx.params.code,
          },
        }
      )
        .then(() => {
          return self.requestSuccess(
            `Requested Currency ${
              status === DELETE ? "Deleted" : "Status Updated"
            } Successfully`,
            res
          );
        })
        .catch((err) => {
          if (err instanceof MoleculerError) return Promise.reject(err);
          else return self.requestError(CodeTypes.UNKOWN_ERROR);
        });
    })
    .catch((err) => {
      if (err instanceof MoleculerError) return Promise.reject(err);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}

function insertCurrency(self, ctx) {
  return Currency.insert(ctx, ctx.params)
    .then((res) => {
      return Currency.find(ctx, {
        query: { status: { [Op.ne]: DELETE } },
      }).then((res) => {
        var arr = res.data;
        return self.requestSuccess("List of Currency's", arr);
      });
    })
    .catch((err) => {
      if (err.name === "Database Error" && Array.isArray(err.data)) {
        if (err.data[0].type === "unique")
          return self.requestError(CodeTypes.ALREADY_EXIST);
      } else if (err instanceof MoleculerError) return Promise.reject(err);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}

function insertConversion(self, ctx) {
  return CurrencyConversion.find(ctx, {
    query: {
      to: ctx.params.to,
      status: ACTIVE,
    },
  }).then((res) => {
    const isDataFound = () => res.data && res.data.length;
    if (isDataFound()) {
      throw CodeTypes.ALREADY_EXIST;
    }
    return CurrencyConversion.insert(ctx, ctx.params)
      .then((res) => {
        return CurrencyConversion.find(ctx, {
          query: { status: { [Op.ne]: DELETE } },
        }).then((conversions) => {
          var arr = conversions.data;
          return self.requestSuccess("List of Currency Conversion's", arr);
        });
      })
      .catch((err) => {
        if (err.name === "Database Error" && Array.isArray(err.data)) {
          if (err.data[0].type === "unique")
            return self.requestError(CodeTypes.ALREADY_EXIST);
        } else if (err instanceof MoleculerError) return Promise.reject(err);
        else return self.requestError(CodeTypes.UNKOWN_ERROR);
      });
  });
}

function fetchAll(self, ctx, query) {
  return Currency.find(ctx, { query })
    .then((res) => {
      var arr = res.data;
      return self.requestSuccess("List of Currency's", arr);
    })
    .catch((err) => {
      if (err.name === "Nothing Found")
        return self.requestError(CodeTypes.NOTHING_FOUND);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}

function fetchAllActiveConversions(self, ctx, query) {
  return CurrencyConversion.find(ctx, { query })
    .then((res) => {
      var arr = res.data;
      return self.requestSuccess("List of Currency Conversion's", arr);
    })
    .catch((err) => {
      if (err.name === "Nothing Found")
        return self.requestError(CodeTypes.NOTHING_FOUND);
      else return self.requestError(CodeTypes.UNKOWN_ERROR);
    });
}
