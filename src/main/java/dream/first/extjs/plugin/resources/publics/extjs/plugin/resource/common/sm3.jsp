<script src="${STATIC_RESOURCES_ROOT_PATH}/js/util/sm3/core.js"></script>
<script src="${STATIC_RESOURCES_ROOT_PATH}/js/util/sm3/cipher-core.js"></script>
<script type="text/javascript"  src="${STATIC_RESOURCES_ROOT_PATH}/js/util/sm3/jsbn.js"></script>
<script type="text/javascript"  src="${STATIC_RESOURCES_ROOT_PATH}/js/util/sm3/jsbn2.js"></script>
<script type="text/javascript"  src="${STATIC_RESOURCES_ROOT_PATH}/js/util/sm3/sm3.js"></script>
<script type="text/javascript">
function sm3(str) {
	var msg = str;
	var msgData = CryptoJS.enc.Utf8.parse(msg);

	var md;
	var sm3keycur = new SM3Digest();
	msgData = sm3keycur.GetWords(msgData.toString());
	//console.log(msgData);
	sm3keycur.BlockUpdate(msgData, 0, msgData.length);
	//console.log(msgData);
	var c3 = new Array(32);
	sm3keycur.DoFinal(c3, 0);
	return sm3keycur.GetHex(c3).toString();
}
</script>
