const moment = require("moment");

function parse(responseData) {
	const parsedData = {};
	parsedData.merchantRequestID = responseData.MerchantRequestID;
	parsedData.checkoutRequestID = responseData.CheckoutRequestID;
	parsedData.resultDesc = responseData.ResultDesc;
	parsedData.resultCode = responseData.ResultCode;

	if (parsedData.resultCode == 0) {
		responseData.CallbackMetadata.Item.forEach(element => {
			switch (element.Name) {
				case "Amount":
					parsedData.amount = element.Value;
					break;
				case "MpesaReceiptNumber":
					parsedData.mpesaReceiptNumber = element.Value;
					break;
				case "TransactionDate":
					parsedData.transtactionDate = moment(
						element.Value,
						"YYYYMMDDhhmmss"
					).unix();
					break;
				case "PhoneNumber":
					parsedData.phoneNumber = element.Value;
					break;
			}
		});
	}

	return parsedData;
}

module.exports = parse;
