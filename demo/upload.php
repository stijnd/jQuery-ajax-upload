<?php 
	$result = array('succes' => true);

	//upload path
	$upload_folder = "uploads";
	$fieldname = 'ajax_upload_field';

	//setup allowed extension and mime-type array
	$allowed = array(
		'image/gif' => 'gif',
		'image/jpeg' => 'jpg',
		'image/png' => 'png',
	);

	$max_file_size = 512000;

	if(isset($_FILES[$fieldname]))
	{
		if(is_dir($upload_folder))
		{
			//get the extesion
			$filename = basename($_FILES[$fieldname]['name']);
			$ext = substr($filename, strrpos($filename, '.') + 1);

			if(in_array($ext, $allowed) && array_key_exists($_FILES[$fieldname]["type"], $allowed))
			{
				if($_FILES[$fieldname]["size"] <= $max_file_size )
				{
					//create target
					$target = $upload_folder.'/'.$filename;

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
					$result['error'] = 'You exceeded the maximum filesize: '.$max_file_size;
				}
			}
			else
			{
				$result['succes'] = false;
				$result['error']  = "You should upload an image with one of the following extensions: .jpg, .gif, .png";
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