/* Author:

*/

$(document).ready(function(){	
	$('.fleupload').ajaxUpload({
		// upload_url: '/upload.php',
		succes: function(response){
			console.log($(this));
			$('#error').text('');
			$('#preview1').html('<img src="'+response.url+'" />');
			//console.log(response.url);
		},
		error: function(error){
			$('#error').text(error);
			$('#preview1').html('');
			//console.error('There was an error: '+error);
		}/*,
		selected: function()
		{
			console.log('There was a file selected');
		}*/
	});
});