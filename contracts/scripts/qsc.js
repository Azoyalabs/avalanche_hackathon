const BASE_URI = "https://app.hoptrail.io/api/eth/check/";

const targetAddress = args[0].slice(2, args[0].length);
const requestId = parseInt(args[1].slice(args[1].length - 32));

const apiResponse = await Functions.makeHttpRequest({
    url: `${BASE_URI}${targetAddress}`,

});

if (apiResponse.error) {
  console.error(apiResponse.error)
  throw Error(`Request failed: ${apiResponse}`)
}

const { data } = apiResponse;

let val = (requestId << 1) + (data.length == 0 ? 1 : 0);
return Functions.encodeUint256(val)
