/* Author:

*/

$(document).ready(function(){	
	$('.fleupload').ajaxUpload({
		// upload_url: '/upload.php',
		succes: function(response){
			console.log(response.url);
			console.log('On succes do this!');
			console.log('The file is located here: '+response.url);
		},
		error: function(error){
			console.error('There was an error: '+error);
		},
		selected: function()
		{
			console.log('There was a file selected');
		}
	});
});



