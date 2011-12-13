<?php 
	$result = array('succes' => true);

	//upload path
	$upload_folder = "uploads";
	$fieldname = 'ajax_upload_field';

	if(isset($_FILES[$fieldname]))
	{
		if(is_dir($upload_folder))
		{
			//create target
			$target = $upload_folder.'/'.basename($_FILES[$fieldname]['name']);

			//upload!
			if(move_uploaded_file($_FILES[$fieldname]['tmp_name'], $target)) {
				$result['succes'] = true;
				$result['url']	  = $target;
			}
			else
			{
				$result['succes'] = false;
				$result['error']  = "Something went wrong while moving the file to the uploads folder?!";
			}
		}
		else
		{
			$result['succes'] = false;
			$result['error']  = "The folder ".$upload_folder." doesn't exist!";
		}	
	}
	else
	{
		$result['succes'] = false;
		$result['error']  = "There was no file located in the $_FILES\['".$fieldname."'\] header!";
	}

	echo json_encode($result);
?>