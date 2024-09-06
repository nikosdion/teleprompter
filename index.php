<!DOCTYPE html>
<html lang="en">
<head>
	<title>
		Custom Teleprompter
	</title>
	<link rel="shortcut icon" type="image/png" href="icon.png">
	<link rel="apple-touch-icon" href="icon.png">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
	<link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Custom Teleprompter</h1>
<?php
$di = new DirectoryIterator(__DIR__);
$countFiles = 0;
foreach ($di as $file):
	if ($file->isDot() || !$file->isFile() || $file->getExtension() != 'md') continue;
	$countFiles++;
	?>
	<a href="prompter.html#<?= htmlentities($file->getBasename('.md')) ?>"
	   class="touchLink"
	>
		<?= htmlentities($file->getBasename('.md')) ?>
	</a>
<?php endforeach; ?>
<?php if (!$countFiles): ?>
<h2>
	How to use
</h2>
<p>
	Upload some <a href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax">Markdown</a> files in the same directory as this script. They must have a lowercase <code>.md</code> extension. They will appear above. Click on one to show it in the teleprompter interface.
</p>
<p>
	Start/stop the teleprompter with the space bar. Adjust the speed with left / right arrow. You can skip ahead or go back by a line using the up / down arrows, or an entire page with Page Up and Page Down. Press F1 for more info.
</p>
<h2>
	Using with a mobile device
</h2>
<p>
	Bookmark this page and make it into an app icon in your home screen. It will then open full screen from that icon.
</p>
<p>
	Most teleprompter remotes send arrow keys and Enter. You can start the script using the left / right arrows (speed adjust starts the script automatically). All teleprompter foot pedals in the market have a mode to send space bar and Enter. Use the left pedal (space) to pause / start the script. You may want to have both a foot pedal <em>and</em> a remote or Bluetooth keyboard connected to your mobile device.
</p>
<p>
	You can invert the colour scheme of the teleprompter by toggling your device's display mode between light and dark.
</p>
<?php endif ?>
</body>
</html>
