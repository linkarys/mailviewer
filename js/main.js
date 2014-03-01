// Functions for checking and unchecking all checkboxes passed by name
baseUrl = "controller.cfm";
$mailbody = $('#eviewer');
$listWrapper = $('#list-wrapper');
$pageMarker = $('#page-marker');
$('#check-all').on('click', toggleCheckboxes);

function updateHighlight() {
	$('.clickable').each(function(index) {
		if (index % 2) {
			$(this).addClass('table-highlight');
		} else {
			$(this).removeClass('table-highlight');
		}
	})
}

function getEmail(filename) {
	$.ajax({
		url: baseUrl,
		data: {
			action: 'show',
			mail: filename
		},
		success: function(data) {
			$mailbody.html(data);
			$mailbody.css({
				'right': '55px',
				'opacity': '1'
			});
		}
	})
}

function removeElement($elem, callback) {
	$elem.fadeOut(400, 'linear', function() {
		$elem.remove();
		updateHighlight();
	})
}


function deleteEmail(filename, elem) {
	$.ajax({
		url: baseUrl,
		data: {
			action: 'deleteEmail',
			mail: filename
		},
		success: function(result) {
			if (result.indexOf('ok') >= 0) {
				removeElement( $(elem.parentNode.parentNode), updateHighlight );
			}
		}
	})
}

function deleteList() {
	var arrMailname = [],
		arrMail = [];

	$('.single-box').each(function() {
		var mailname = this.name.substr(0, this.name.lastIndexOf('.'));

		if (this.checked) {
			arrMailname.push(this.name);
			arrMail.push($('#'+ mailname));
		}
	});

	$.ajax({
		url: baseUrl,
		data: {
			action: 'deleteList',
			lstMail: arrMailname.join(',')
		},
		success: function(result) {
			if (result.indexOf('ok') >= 0) {
				$.each(arrMail, function() {
					removeElement(this);
				})
			}
		}
	})
}


function deleteAll() {
	$.ajax({
		url: baseUrl,
		data: {
			action: 'deleteAll'
		},
		success: function(result) {
			if (result.indexOf('ok') >= 0) {
				refresh();
			}
		}
	})
}

$('body').keydown(function(e) {
	if (e.which === 27) {
		$mailbody.css({
			'right': '-1000px',
			'opacity': 0
		})
	}
});

$mailbody.scroll(function(e) {
	e.preventDefault;
	return false;
})

function toggleCheckboxes() {
	var isChecked = this.checked;

	$('.single-box').each(function() {
		this.checked = isChecked;
	})
}


function refresh() {
	location.reload(false);
}

$('#prev-page').click(function(e) {
	e.preventDefault();
	$listWrapper.fadeOut();
	$.ajax({
		url: baseUrl,
		data: {
			action: 'prevPage'
		},
		success: function(data) {
			console.log($listWrapper);
			console.log(data);
			$listWrapper.stop(true, true).show().html(data);
			$pageMarker.html($($.parseHTML(data)).find('#toolkit-info').html());
		}
	})
})

$('#next-page').click(function(e) {
	e.preventDefault();
	$listWrapper.fadeOut();
	$.ajax({
		url: baseUrl,
		data: {
			action: 'nextPage'
		},
		success: function(data) {
			$listWrapper.stop(true, true).show().html(data);
			$pageMarker.html($($.parseHTML(data)).find('#toolkit-info').html());
		}
	})
})

$('#perpage').change(function() {
	$listWrapper.fadeOut();
	$.ajax({
		url: baseUrl,
		data: {
			action: 'updatePerpage',
			perPage: $(this).val()
		},
		success: function(data) {
			$listWrapper.stop(true, true).show().html(data);
			$pageMarker.html($($.parseHTML(data)).find('#toolkit-info').html());
		}
	})
})


function doPerPage(oRef) {
	var oPage = document.getElementById('PerPage');
	oRef.href = oRef.href + "&PerPage=" + oPage.value;
}
