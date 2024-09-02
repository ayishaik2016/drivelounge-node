const DuserModel = require("./DuserModel");
const DadminModel = require("./DadminModel");

const DagentModel = require("./DagentModel");
const DagentlangModel = require("./DagentlangModel");
const DagentimageModel = require("./DagentimageModel");

const DtokenModel = require("./Dtoken");
const DlanguageModel = require('./Dlanguage');

// Role Management
const DmoduleModel = require('./DmoduleModel');
const DmodulelangModel = require('./DrolemodulelangModel');
const DroleModel = require('./DroleModel');

const DactivitylogModel = require("./DactivitylogModel");
const DpermissionModel = require("./DpermissionModel");

// Done
const DappconfigModel = require("./DappconfigModel");
const DsocialmediaModel = require("./DsocialmediaModel");
const DsmsModel = require("./DsmsModel");
const DsmtpModel = require("./DsmtpModel");
const DpushnotificationModel = require("./DpushnotificationModel");
// Application
const DapplicationModel = require('./DapplicationModel');
// Car
const DcarbrandModel = require('./DcardbrandModel');
const DcarmodelModel = require('./DcarmodelModel');
const DcaryearModel = require('./DcaryearModel');
const DcaractionModel = require('./DcaractionModel');
const DcarinsuranceModel = require('./DcarinsuranceModel');
const DcarmilegeModel = require('./DcarmilegeModel');
const DcarcylindersModel = require('./DcarcylindersModel');
const DcardriverModel = require('./DcardriverModel');
const DcartransmissionModel = require('./DcartranmissionModel');
const DcarseatModel = require('./DcarseatModel');
const DcarspeedModel = require('./DcarspeedModel');
const DcarinformationModel = require('./DcarinformationModel');
const DcarfeaturesModel = require('./DcarfeaturesModel');
const DcarinterriorModel = require('./DcarinterriorModel');
const DcarsupportdocumentModel = require('./DcarsupportdocumentModel');
const DcarareaModel = require('./DcarareaModel');
const DcaradditionalModel = require("./DcaradditionalModel");
const DfavoriteModel = require("./DfavoriteModel");
const DcarproofModel = require('./DcarproofModel');
//Billing - Coupon
const DcouponModel = require('./DcouponModel');
const DagentcouponModel = require('./DagentcouponModel');
const DusercouponModel = require('./DusercouponModel');
const DusedcouponModel = require('./DusedcouponModel');
const DcoupontypeModel = require('./DcoupontypeModel');
const DcouponapptypeModel = require('./DcouponapptypeModel');
// Booking 
const DbookingModel = require('./DbookingModel');
const DbookingbillingModel = require('./DbookingbillingModel');
const DbookingfeatureModel = require('./DbookingfeatureModel');
// Payment
const DpaymentmethodModel = require('./DpaymentmethodModel');
const DcreditcardModel = require('./DcreditcardModel');
// Address
const DcountryModel = require('./DcountryModel');
const DcityModel = require('./DcityModel');
const DareaModel = require('./DareaModel');
const DaddresstypeModel = require('./DaddresstypeModel');

const DcurrencyModel = require('./DcurrencyModel');
const DcurrencyconversionModel = require('./DcurrencyconversionModel');

const DreviewModel = require('./DreviewModel');

const DcmsModel = require('./DcmsModel');
const DcmslangModel = require('./DcmslangModel');
const DfaqModel = require('./DfaqModel');
const DfaqlangModel = require('./DfaqlangModel');
const DenquirModel = require('./DenquiryModel');
const DcartypeModel = require("./DcartypeModel");
const DpaymentModel = require('./DpaymentModel');

module.exports = {
    Dactivitylog: DactivitylogModel,
    Dpermission: DpermissionModel,
    Drole: DroleModel,
    Dmodulelang: DmodulelangModel,
    Dmodule: DmoduleModel,
    Duser: DuserModel,
    Dadmin: DadminModel,
    Dagent: DagentModel,
    Dagentlang: DagentlangModel,
    Dagentimage: DagentimageModel,
    //done
    Dappconfig: DappconfigModel,
    Dsocialmedia: DsocialmediaModel,
    Dsms: DsmsModel,
    Dsmtp: DsmtpModel,
    Dpushnotification: DpushnotificationModel,
    // Application
    Dapplications: DapplicationModel,
    // Car Model
    Dcarbrand: DcarbrandModel,
    Dcarmodel: DcarmodelModel,
    Dcaryear: DcaryearModel,
    Dcaraction: DcaractionModel,
    Dcarinsurance: DcarinsuranceModel,
    Dcarmilege: DcarmilegeModel,
    Dcarcylinders: DcarcylindersModel,
    Dcardriver: DcardriverModel,
    Dcartransmission: DcartransmissionModel,
    Dcarseat: DcarseatModel,
    Dcarspeed: DcarspeedModel,
    Dcarinformation: DcarinformationModel,
    Dcarfeatures: DcarfeaturesModel,
    Dcarinterrior: DcarinterriorModel,
    Dcarsupportdocument: DcarsupportdocumentModel,
    Dcaradditional: DcaradditionalModel,
    Dfavorites: DfavoriteModel,
    Dcarproof: DcarproofModel,
    Dcartype: DcartypeModel,
    Dcararea: DcarareaModel,
    Dcoupon: DcouponModel,
    Dcoupontype: DcoupontypeModel,
    Dcouponapptype: DcouponapptypeModel,
    Dusercoupon: DusercouponModel,
    Dagentcoupon: DagentcouponModel,
    Dusedcoupon: DusedcouponModel,

    Dbooking: DbookingModel,
    Dbookingbilling: DbookingbillingModel,
    Dbookingfeature: DbookingfeatureModel,
    Dpaymentmethod: DpaymentmethodModel,
    Dcreditcard : DcreditcardModel,
    // Address
    Dcountry: DcountryModel,
    Dcity: DcityModel,
    Darea: DareaModel,
    Daddresstype: DaddresstypeModel,

    Dcurrency: DcurrencyModel,
    Dcurrencyconversion: DcurrencyconversionModel,

    Dcms: DcmsModel,
    Dcmslang: DcmslangModel,
    Dfaq: DfaqModel,
    Dfaqlang: DfaqlangModel,
    Dreview: DreviewModel,
    Denquiry: DenquirModel,
    Dtoken: DtokenModel,
    Dlanguage: DlanguageModel,

    Dpayment: DpaymentModel
}