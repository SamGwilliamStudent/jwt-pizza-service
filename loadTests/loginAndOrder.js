import { sleep, check, group, fail } from 'k6';
import http from 'k6/http';
import jsonpath from 'https://jslib.k6.io/jsonpath/1.0.2/index.js';

export const options = {
	cloud: {
		distribution: {
			'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 },
		},
		apm: [],
	},
	thresholds: {},
	scenarios: {
		Scenario_1: {
			executor: 'ramping-vus',
			gracefulStop: '30s',
			stages: [
				{ target: 5, duration: '30s' },
				{ target: 15, duration: '1m' },
				{ target: 10, duration: '30s' },
				{ target: 0, duration: '30s' },
			],
			gracefulRampDown: '30s',
			exec: 'scenario_1',
		},
	},
};

export function scenario_1() {
	if (
		!check(response, {
			'status equals 200': (response) => response.status.toString() === '200',
		})
	) {
		console.log(response.body);
		fail('Login was *not* 200');
	}

	let response;

	const vars = {};

	group('page_1 - https://pizza.samgwilliam.click/', function () {
		response = http.get('https://pizza.samgwilliam.click/', {
			headers: {
				accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9',
				'cache-control': 'max-age=0',
				priority: 'u=0, i',
				'sec-ch-ua':
					'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'document',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-site': 'same-origin',
				'sec-fetch-user': '?1',
				'upgrade-insecure-requests': '1',
			},
		});
		sleep(72.2);

		response = http.put(
			'https://pizza-service.samgwilliam.click/api/auth',
			'{"email":"a@jwt.com","password":"admin"}',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'content-type': 'application/json',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-ch-ua':
						'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);
		check(response, {
			'status equals 200': (response) => response.status.toString() === '200',
		});

		vars['token1'] = jsonpath.query(response.json(), '$.token')[0];

		response = http.options(
			'https://pizza-service.samgwilliam.click/api/auth',
			null,
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'access-control-request-headers': 'content-type',
					'access-control-request-method': 'PUT',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);
		sleep(14.6);

		response = http.get('https://pizza-service.samgwilliam.click/api/order/menu', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9',
				authorization: `Bearer ${vars['token1']}`,
				'content-type': 'application/json',
				origin: 'https://pizza.samgwilliam.click',
				priority: 'u=1, i',
				'sec-ch-ua':
					'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		});

		response = http.options(
			'https://pizza-service.samgwilliam.click/api/order/menu',
			null,
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'access-control-request-headers': 'authorization,content-type',
					'access-control-request-method': 'GET',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);

		response = http.get('https://pizza-service.samgwilliam.click/api/franchise', {
			headers: {
				accept: '*/*',
				'accept-encoding': 'gzip, deflate, br, zstd',
				'accept-language': 'en-US,en;q=0.9',
				authorization: `Bearer ${vars['token1']}`,
				'content-type': 'application/json',
				origin: 'https://pizza.samgwilliam.click',
				priority: 'u=1, i',
				'sec-ch-ua':
					'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-platform': '"macOS"',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'cors',
				'sec-fetch-site': 'same-site',
			},
		});

		response = http.options(
			'https://pizza-service.samgwilliam.click/api/franchise',
			null,
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'access-control-request-headers': 'authorization,content-type',
					'access-control-request-method': 'GET',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);
		sleep(10.6);

		response = http.post(
			'https://pizza-service.samgwilliam.click/api/order',
			'{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					authorization: `Bearer ${vars['token1']}`,
					'content-type': 'application/json',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-ch-ua':
						'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);

		response = http.options(
			'https://pizza-service.samgwilliam.click/api/order',
			null,
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'access-control-request-headers': 'authorization,content-type',
					'access-control-request-method': 'POST',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'same-site',
				},
			}
		);
		sleep(2.5);

		response = http.post(
			'https://pizza-factory.cs329.click/api/order/verify',
			'{"jwt":"eyJpYXQiOjE3NDMyMDcwMjAsImV4cCI6MTc0MzI5MzQyMCwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJnd2lsbDM0IiwibmFtZSI6IlNhbSBHd2lsbGlhbSJ9LCJkaW5lciI6eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIn0sIm9yZGVyIjp7Iml0ZW1zIjpbeyJtZW51SWQiOjIsImRlc2NyaXB0aW9uIjoiUGVwcGVyb25pIiwicHJpY2UiOjAuMDA0Mn1dLCJzdG9yZUlkIjoiMSIsImZyYW5jaGlzZUlkIjoxLCJpZCI6MTR9fQ.WpdObOzVV33vA7EGCXMWpD2xjmQwNGom64WoELBsnZRfvkTGGdKln8nSW4KUaH6t9Lz4BMjyCqakq2lMvXnLlpmEy_2U0JeSgAAccM3eZhgvlYryBShGF990abj9nn_8T3zYka5TpGBWdX_wVLw67kqv_8pg197N9GU_-o6QNJ4xmozBu1ERgKoqWSVRcxZwVV3Nw9zThCqRAy8lBqD-7aBiVlVD-UQS-atBE4N-CVovdxnpCGhoIu2sc683LIZGVhiujS8Msxd6Z_GAKeJmu560MDNQC6G7xkNnxrxW_f8zw8SM99GIpXKpgPCZii0YnUaiEJyMtRXs48mSIOT71zw-RHs275HeHHe6q8e8PXB4VznKe3rDEAgihl_78_q1LoA4DgLAgcm0T4IrktPxt8NXDRAYoJGftuXnuJAvDKd6iZTkNoNXcxNbMhb8BiX1kg08SCazkOnWo-fgDuPh_dwX1Pi81UK23n6EiI9nSDZfXQBTSlaNlYZz79sVyFbZBgWKOko1pyxDWp6alc5W31vrCbHvTf9-5PNX1XH9zOe0N0BWE9PSL67WBnvKmS6RxerTC7BIIiKR7AWvCO4h7jAK_tthFfdosW_GKR8hulacangWR703mIXZa9geTUUT88rI-eIAUXx5xI5h5sVRXpqO3nS4AX6YEKz8OAGfYJY"}',
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					authorization: `Bearer ${vars['token1']}`,
					'content-type': 'application/json',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-ch-ua':
						'"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
					'sec-ch-ua-mobile': '?0',
					'sec-ch-ua-platform': '"macOS"',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
					'sec-fetch-storage-access': 'active',
				},
			}
		);

		response = http.options(
			'https://pizza-factory.cs329.click/api/order/verify',
			null,
			{
				headers: {
					accept: '*/*',
					'accept-encoding': 'gzip, deflate, br, zstd',
					'accept-language': 'en-US,en;q=0.9',
					'access-control-request-headers': 'authorization,content-type',
					'access-control-request-method': 'POST',
					origin: 'https://pizza.samgwilliam.click',
					priority: 'u=1, i',
					'sec-fetch-dest': 'empty',
					'sec-fetch-mode': 'cors',
					'sec-fetch-site': 'cross-site',
				},
			}
		);
	});
}
