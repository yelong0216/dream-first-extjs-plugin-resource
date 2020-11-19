
function encryptRSA(value) {
	var key = rsaPublicKey;
	var rsa = new RSAKey();
	rsa.setPublic(key, "10001");
	var res = rsa.encrypt(value);
	return linebrk(res, 64);
}
