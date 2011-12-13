/* Author:

*/

$(document).ready(function(){	
	$('.fleupload').ajaxUpload({
		// upload_url: '/upload.php',
		succes: function(){
			console.log('On succes do this!');
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



