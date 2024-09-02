// All strings must be different
module.exports = {
	// Errors on Table1
	T1_NOTHING_FOUND: "Table1: Nothing Found",
	T1_FIRST_CONSTRAINT: "Invalid First",
	T1_THIRD_CONSTRAINT: "Invalid Third",

	// Errors on Table2
	T2_NOTHING_FOUND: "Table2: Nothing Found",
	T1_SECOND_CONSTRAINT: "Invalid Second",

	// Errors on Table1 & Table2
	T1_T2_NOTHING_FOUND: "Nothing Found",

	// Errors on Users
	USERS_NOT_LOGGED_ERROR: "User Not Logged",
	USERS_NOTHING_FOUND: "Invalid Credentials",
	USERS_USERNAME_CONSTRAINT: "Invalid username or email",
	USERS_FORBIDDEN_REMOVE: "Forbidden Remove",
	USERS_INVALID_ROLE: "Invalid Role",
	USERS_PASSWORD_MATCH: "Passwords does not match",
	USERS_VERIFICATION: "Verification_Pending",
	// Errors on Auth
	AUTH_INVALID_CREDENTIALS: "Invalid Credentials",
	AUTH_ADMIN_RESTRICTION: "Restricted Action",
	AUTH_ACCESS_DENIED: "Access Denied",
	AUTH_INVALID_TOKEN: "Invalid Token",
	AUTH_NO_TOKEN: "Token Required",
	AUTH_UNAPPROVED: "Approval Pending Please contact the Admin",
	AUTH_UNAPPROVED_TOKEN: "Agent Approval Pending Please contact the Admin",
	AUTH_REJECT_TOKEN: "Agent Approval Request has been rejected Please contact the Admin",

	// Unknown Error
	UNKOWN_ERROR: "Unknown Error",

	// Errors on Country
	COUNTRY_NOT_LOGGED_ERROR: "Country Not Logged",
	COUNTRY_NOTHING_FOUND: "Unknown Countryname",
	COUNTRY_USERNAME_CONSTRAINT: "Invalid Countryname",
	COUNTRY_FORBIDDEN_REMOVE: "Forbidden Remove",
	COUNTRY_INVALID_ROLE: "Invalid Role",
	ALREADY_EXIST: "Already exist!",

	ALREADY_EXIST_EMAIL_OR_MOBILE_NUMBER: "Email id or mobile number was already registered!",
	//common
	NOTHING_FOUND: "Data does not exist",

	// Errors on Voucher
	COUPONCODE_ALREADY_EXIST: "Already exist!",
	INVALID_COUPON: "Coupon Does Not Exist",
	USED_COUPON: "Coupon Already Used",
	EXCEEDED_MAX_REDUMPTION: "Redumption value exceeded the maximum",
	MINIMUM_CART_VALUE: "Insufficient Amount to Add this Coupon",
	COUPONCODE_APPLIED: "Coupon code applied successfully",
	INVALID_AGENT: "Coupon not applicable for this agent.",
	INVALID_USER: "You are not eligible to apply this couponcode for this model",
	COUPONCODE_EXPIRED: "Applied coupon code has expired, please try new one.",

	// Errors on Car Brand
	CARBRAND_ALREADY_EXIST: "Already exist!",

	// Errors on Car Model
	CARMODEL_ALREADY_EXIST: "Already exist!",

	// Errors on Car Year
	CARYear_ALREADY_EXIST: "Already exist!",

	// Errors on Car Action
	CARACTION_ALREADY_EXIST: "Already exist!",

	// Errors on Car Insurance
	CARINSURANCE_ALREADY_EXIST: "Already exist!",

	// Errors on Car Milege
	CARMILEGE_ALREADY_EXIST: "Already exist!",

	// Errors on Car Cylinders
	CARCYLINDERS_ALREADY_EXIST: "Already exist!",

	// Errors on Car Driver
	CARDRIVER_ALREADY_EXIST: "Already exist!",

	// Errors on Car Transmission
	CARTRANSMISSION_ALREADY_EXIST: "Already exist!",

	// Errors on Car Seat
	CARSEAT_ALREADY_EXIST: "Already exist!",

	// Errors on Car Speed
	CARSPEED_ALREADY_EXIST: "Already exist!",

	// Errors on Car Information
	CARINFORMATION_ALREADY_EXIST: "Already exist!",

	// Errors on Car Features
	CARFEATURES_ALREADY_EXIST: "Already exist!",

	// Errors on Car Interrior
	CARINTERRIOR_ALREADY_EXIST: "Already exist!",

	// User Role and Permission not set
	INVALID_ROLE_PERMISSION: "Invalid user role or no permission assgined",

	CHECK_MAIL_FOR_OTP: "Please check your mail for the OTP",
	UPDATED_SUCCESSFULLY: "Updated successfully",
	INVALID_OTP: "Invalid OTP"
};
