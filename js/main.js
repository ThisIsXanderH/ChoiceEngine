// JavaScript Document
CKEDITOR.replace('txtMain');
function updatePageList(/*searchTerm*/) {
	searchTerm = $('#txtPageSearch').val(); //Implement search narrowing
	$('#pagesList').html('');
	$('#listPages').html('');
	$('#selStartPage').html('');
	var thisClass,listClass;
	for(var i=0;i<pageName.length;i++) {
		if(i == pageID) {
			thisClass = "currentPageListing";
		} else {
			thisClass = "pageListing";
		}
		if(pageName[i] == storyPageStart) {
			listClass = "pageFirst";
		} else {
			listClass = "pageRegular";
		}
		$('#pagesList').append('<li class="'.concat(listClass,'"><a class="',thisClass,'" data-id="',i,'">',pageName[i],'</a></li>'));
		$('#listPages').append('<option value="'.concat(pageName[i],'">'));
		$('#selStartPage').append('<option value="'.concat(pageName[i],'">',pageName[i],'</option>'));
	}
}

$('#txtPageSearch').on('input propertychange paste', function() {
	updatePageList();
});
$('#btnPageSearch').click(function() {
	updatePageList();
});
/* BEGIN BLANK STORY FILES */

var storyPageStart;
var storyTitle;
var storyAuthor;

var pageName;
var pageText;
var pageChoice;
var pagePointerText;
var pagePointerDestination;
var pagePointerName;
var pageID;
/* END BLANK STORY FILES */

function newStory() {
	/* BEGIN BLANK STORY FILES */
	
	storyPageStart = "Page 1";
	storyTitle = "Untitled Story";
	$('#txtStoryTitle').val(storyTitle);
	storyAuthor = "Jane Doe";
	$('#txtStoryAuthor').val(storyAuthor);
	
	pageName = [];
	pageText = [];
	pageChoice = [];
	pagePointerText = [];
	pagePointerDestination = [];
	pagePointerName = [];
	pageID = 0;
	pageAdd();
	/* END BLANK STORY FILES */
}
newStory();

function storyLoad(jsonIn) {
	console.log(jsonIn);
	var json = $.parseJSON(jsonIn);
	console.log(json);
	
	
	storyPageStart = unescapeJSON(json.gameSettings.start);
	storyTitle = unescapeJSON(json.gameSettings.title);
	$('#txtStoryTitle').val(storyTitle);
	storyAuthor = unescapeJSON(json.gameSettings.author);
	$('#txtStoryAuthor').val(storyAuthor);
	
	
	pageName = [];
	pageText = [];
	pageChoice = [];
	pagePointerText = [];
	pagePointerDestination = [];
	pagePointerName = [];
	
	$.each(json.pages,function(i,v) {
		pageName.push(unescapeJSON(json.pages[i].name));
		pageText.push(unescapeJSON(json.pages[i].text));
		pageChoice.push(unescapeJSON(json.pages[i].choice));
		pagePointerText.push([]);
		pagePointerDestination.push([]);
		pagePointerName.push([]);
		$.each(json.pages[i].pointers,function(w,k) {
			pagePointerText[i].push(json.pages[i].pointers[w].text);
			pagePointerDestination[i].push(json.pages[i].pointers[w].destination);
			pagePointerName[i].push(json.pages[i].pointers[w].name);
		});
	});
	
	
	constructionPageLoad($.inArray(storyPageStart,pageName));
}

$('#btnPageNew').click(function() {
	pageAdd();
});

function pageAdd() {
	newNum = pageName.length + 1;
	while($.inArray("Page " + newNum,pageName) != -1) {
		newNum += 1;
	}
	pageName.push("Page " + newNum);
	pageText.push("");
	pageChoice.push("");
	pagePointerText.push([]);
	pagePointerDestination.push([]);
	pagePointerName.push([]);
	updatePageList();
	//$.inArray($('#txtPageName').
};

function loadPointers(pageID) {	
	$('#pointerList').html('');
	if(pagePointerText[pageID].length == 0) {
		addPointer();
	} else {
		$.each(pagePointerText[pageID],function() {
			addPointerPhysical();
		});
	}
	/*
	for(var i=0;i<pagePointerText[pageID].length;i++) {	
		
		/*$('#pointerList').append('<span class="pointer"><button class="btnDeletePointer">Delete</button><br>Text: <input class="pointerText" type="text"/><br>Leads to: <input class="pointerDestination" list="listPages"/><br>Name: <input class="pointerName" type="text"/></span>');*/
	//}*/
	$('.pointer').each(function(index, element) {
		$('.pointerText',this).val(pagePointerText[pageID][index]);
		$('.pointerDestination',this).val(pagePointerDestination[pageID][index]);
		$('.pointerName',this).val(pagePointerName[pageID][index]);
    });
}

$('#btnAddPointer').click(function() {
	addPointer();
});

function addPointerPhysical() {
	var html = '<span class="pointer"><button class="btnDeletePointer">Delete</button><br>Text: <input class="pointerText" type="text"/><br>Leads to: <input class="pointerDestination" list="listPages"/><br>Name: <input class="pointerName" type="text"/></span>';
	$('#pointerList').append(html);
}

function addPointer() {
	addPointerPhysical();
	pagePointerText[pageID].push('');
	pagePointerDestination[pageID].push('');
	pagePointerName[pageID].push('');
};

$(document).on('click','.btnDeletePointer',function() {
	$(this).parent().remove();
	if($('#pointerList').children().length == 0) {
		addPointer(); //Always one pointer on offer
	}
	//loadPointers(pageID);
});

$('#btnPageSave').click(function() {
	//TODO: Make this automatically save on change/page switch?
	
	/* Save Name */
	//TODO: Optionally cascade name changes?
	if($('#txtPageName').val()=='') {
		alert('Page Name Needed');
	} else if($.grep(pageName,function(n,i) {
		return (n == $('#txtPageName').val() && i != pageID);
	}).length > 0) {
		alert('Page by this name already exists');
	} else {
		if(pageName[pageID] == storyPageStart) {
			storyPageStart = $('#txtPageName').val();
		}
		pageName[pageID] = $('#txtPageName').val();
	}
	 
	
	/* Save Text */
	pageText[pageID] = CKEDITOR.instances.txtMain.getData();
	
	/* Save Choice */
	pageChoice[pageID] = $('#txtPageChoice').val();
	
	/* Save Pointers */
	pagePointerText[pageID] = [];
	pagePointerDestination[pageID] = [];
	pagePointerName[pageID] = [];
	$('.pointer').each(function(index, element) {
		pagePointerText[pageID].push($('.pointerText',this).val());
		pagePointerDestination[pageID].push($('.pointerDestination',this).val());
		pagePointerName[pageID].push($('.pointerName',this).val());
    });
	
	updatePageList();
});

$(document).on('click','.pageListing',function() {
	constructionPageLoad($(this).data('id'));
});
function constructionPageLoad(page) {
	//Load Document
	pageID = parseInt(page); //Is this the best way to do this?
	/* Load Name */
	$('#txtPageName').val(pageName[pageID]);
	/* Load Choice */
	$('#txtPageChoice').val(pageChoice[pageID]);
	
	/* Load Text */
	CKEDITOR.instances.txtMain.setData(pageText[pageID]);
	
	/* Load Pointers */
	loadPointers(pageID);
	
	updatePageList();
}

updatePageList();

$('#btnPageTest').click(function() {
	loadTestPage(pageID);
});

$('#storyTesting').hide();

function loadTestPage(pageID) {
	/* This stuff only needs to run once */
	$('#menuConstruction').hide();
	$('#menuTesting').show();
	$('#storyConstruction').hide();
	$('#storyTesting').show();
	$('#storyTitle').text(storyTitle);
	$('#storyAuthor').text(storyAuthor);
	/* General content */
	$('#pageHTML').html(pageText[pageID]);
	$('#pageChoiceTitle').html(pageChoice[pageID]);
	$('#pageChoices').html('');
	if(pagePointerText[pageID].length > 0) {
		$.each(pagePointerText[pageID],function(i, value) {
			$('#pageChoices').append('<button class="makeDecision">'.concat(value,'</button>'));
		});
	}
	/*for(var i=0;i<pagePointerText[pageID].length;i++) {
		$('#pageChoices').append('<button class="makeDecision">'.concat(pagePointerText[pageID][i],'</button>'));
	}*/
	$('.makeDecision').each(function(i, element) {
        $(this).addClass(pagePointerName[pageID][i]);
		$(this).data('destination',pagePointerDestination[pageID][i]);
    });
};

$(document).on('click','.makeDecision',function() {
	var dest = $.inArray($(this).data('destination'),pageName);
	loadTestPage(dest);
});


$('#btnStoryPages').click(function() {
	$('#storyPages').show();
	$('#storySettings').hide();
});


$('#btnStoryTestStart').click(function() {
	var pageID = $.inArray(storyPageStart,pageName);
	console.log(pageID);
	loadTestPage(pageID);
});
$('#btnStoryTestStop').click(function() {
	$('#menuConstruction').show();
	$('#menuTesting').hide();
	$('#storyConstruction').show();
	$('#storyTesting').hide();
});

function makeJSON() {
	var json = "{";
	json = json.concat('"gameSettings":{"title":"',escapeJSON(storyTitle),'","author":"',escapeJSON(storyAuthor),'","start":"',escapeJSON(storyPageStart),'"},');
	json = json.concat('"pages":[');
	$.each(pageName,function(i,v) {
		json = json.concat('{"name":"',escapeJSON(pageName[i]),'","text":"',escapeJSON(pageText[i]),'","choice":"',escapeJSON(pageChoice[i]),'","pointers":[');
		$.each(pagePointerText[i],function(w,v) {
			json = json.concat('{"text":"',escapeJSON(pagePointerText[i][w]),'","destination":"',escapeJSON(pagePointerDestination[i][w]),'","name":"',escapeJSON(pagePointerName[i][w]),'"},');
		});
		if(json.substr(json.length - 1) == ",") {
			json = json.slice(0,-1); //Remove trailling comma
		}
		json = json.concat(']},');
	});
	json = json.slice(0,-1); //Remove trailling comma
	json = json.concat(']}');
	console.log(json);
	return json;
}
$('#btnStorySave').click(function() {
	
	makeJSON();
});
function escapeJSON(str) {
	return encodeURIComponent(str);
}

function unescapeJSON(str) {
	return decodeURIComponent(str);
}

dialogStorySettings = $('#storySettings').dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Save": function() {
			storyPageStart = $('#selStartPage').val();
			storyTitle = $('#txtStoryTitle').val();
			storyAuthor = $('#txtStoryAuthor').val();
			updatePageList();
		  	dialogStorySettings.dialog( "close" );
		},
		Cancel: function() {
			$('#selStartPage').val(storyPageStart);
			$('#txtStoryTitle').val(storyTitle);
			$('#txtStoryAuthor').val(storyAuthor);
		 	dialogStorySettings.dialog( "close" );
		}
	},
	close: function() {
		
	}
});

$('#btnStorySettings').click(function() {
	dialogStorySettings.dialog("open");
});

dialogStoryExport = $('#storySave').dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Select": function() {
			$('#txtStorySaved').select();
		},
		"Close": function() {
		  	dialogStoryExport.dialog( "close" );
		}
	},
	close: function() {
		
	}
});

$('#txtStorySaved').parent().css('overflow','hidden');

$('#btnStorySave').click(function() {
	$('#txtStorySaved').text(makeJSON);
	dialogStoryExport.dialog("open");
});

dialogStoryImport = $('#storyLoad').dialog({
	autoOpen: false,
	height: 300,
	width: 350,
	modal: true,
	buttons: {
		"Load": function() {
			storyLoad($('#txtStoryLoad').val());
		  	dialogStoryImport.dialog( "close" );
		},
		"Close": function() {
		  	dialogStoryImport.dialog( "close" );
		}
	},
	close: function() {
		
	}
});

$('#txtStoryLoad').parent().css('overflow','hidden');

$('#btnStoryLoad').click(function() {
	$('#txtStoryLoad').text('');
	dialogStoryImport.dialog("open");
});