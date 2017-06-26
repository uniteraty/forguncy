// DB接続情報の取得
var DbInfo;
var GetDbInfo = function (Forguncy) {
	var config = function (id) {
		var ret = { result: null, value: null};
		var defer = $.Deferred();

		function setResult(data, flg) {
			ret.result = flg;
			ret.value = data;
			flg ? defer.resolve(ret) : defer.reject(ret);
		}

		Forguncy.getTableData("View_SystemConfig", { "categoryID": 2, "id" : id }, 
			function(data){             // レコードの取得に成功した場合
				setResult(data, true);
			}, 
			function(errorMessage){     // レコードの取得に失敗した場合
				setResult(errorMessage, false);
			}
		);

		return defer.promise();
	};

	var dbInfo = [];
	$.when(config("server"), config("catalog"), config("user"), config("password"))
		.done(function (data1, data2, data3, data4) {
			dbInfo.push({ id : data1.value.id, value : data1.value.val});
			dbInfo.push({ id : data2.value.id, value : data2.value.val});
			dbInfo.push({ id : data3.value.id, value : data3.value.val});
			dbInfo.push({ id : data4.value.id, value : data4.value.val});
		})
		.fail(function () {
		})
		.always(function () {
			var result = (function (arr) {
				var ret = { user:null, password:null, server:null, catalog:null, result:false };
				for (var i = 0; i < arr.length; i++) {
					switch (arr[i].id) {
						case "server":
							ret.server = arr[i].value;
							break;
						case "catalog":
							ret.catalog = arr[i].value;
							break;
						case "user":
							ret.user = arr[i].value;
							break;
						case "password":
							ret.password = arr[i].value;
							break;
					}
				}
				
				DbInfo = ret;
			})(dbInfo);
			
		});
});
