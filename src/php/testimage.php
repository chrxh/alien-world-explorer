<?php
	const IMAGE_X = 1200;
	const IMAGE_Y = 350;

  header("Content-type: image/png");

  $image = imagecreatetruecolor(IMAGE_X, IMAGE_Y);

  for ($i = 1; $i < 10000; $i++) {
    $x = rand(0, IMAGE_X);
    $y = rand(0, IMAGE_Y);
    $farbe = imagecolorallocate($image, rand(0, 255), rand(0, 255), rand(0, 255));
    imagefilledrectangle ($image, $x*4, $y*4, $x*4+3, $y*4+3, $farbe);
  }

  imagepng($image);
  imageDestroy($image);
?>
