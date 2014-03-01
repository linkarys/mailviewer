baseUrl = "controller.cfm";

function refresh() {
	location.reload(false);
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


function nextPage(e) {
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
}


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