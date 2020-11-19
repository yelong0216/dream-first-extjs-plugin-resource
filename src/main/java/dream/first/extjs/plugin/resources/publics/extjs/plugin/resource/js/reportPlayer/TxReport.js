var requiredMajorVersion = 9;

var requiredMinorVersion = 0;

var requiredRevision = 124;

function create_TxsecReportWeb(id, url, newsId)
{

var flashvars=newsId;
var hasProductInstall = DetectFlashVer(6, 0, 65);
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

if ( hasProductInstall && !hasRequestedVersion ) {
	
	var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
	var MMredirectURL = window.location;
    document.title = document.title.slice(0, 47) + " - Flash Player Installation";
    var MMdoctitle = document.title;

	AC_FL_RunContent(
		"src", "playerProductInstall",
		"FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
		"width", "100%",
		"height", "100%",
		"align", "middle",
		"id", "TxsecReportWeb",
		"quality", "high",
		"bgcolor", "#ffffff",
		"name", "TxsecReportWeb",
		"allowScriptAccess","sameDomain",
		"type", "application/x-shockwave-flash",
		"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
} else if (hasRequestedVersion) {
	
	AC_FL_RunContent(
			"src", url,
			"flashvars", flashvars,
			"width", "100%",
			"height", "100%",
			"align", "middle",
			"id", "TxsecReportWeb",
			"quality", "high",
			"bgcolor", "#ffffff",
			"name", "TxsecReportWeb",
			"allowScriptAccess","sameDomain",
"allowFullScreen","true", 
			"type", "application/x-shockwave-flash",
			"pluginspage", "http://www.adobe.com/go/getflashplayer"
	);
  } else {  // flash is too old or we can't detect the plugin
    var alternateContent = 'Alternate HTML content should be placed here. '
  	+ 'This content requires the Adobe Flash Player. '
   	+ '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
    document.write(alternateContent);  // insert non-flash content
  }
}

