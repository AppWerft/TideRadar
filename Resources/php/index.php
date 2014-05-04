<?

if ($_SERVER["HTTP_ACCEPT"] != 'text/json') { 
$start = time();
$data = json_decode(file_get_contents('./data.json'));
$res = array();
for ($i=0;$i<count($data);$i++) {
	@$res[$i] = new stdClass();
	$res[$i]->title = $data[$i]->title;
	$res[$i]->id = $data[$i]->id;
	$res[$i]->loc = $data[$i]->loc;
	$res[$i]->values = array();
	$id = $data[$i]->id;
	$url= 'http://mobile.bsh.de/cgi-bin/gezeiten/was_mobil.pl?ort=' . $id . '&zone=Gesetzliche+Zeit&niveau=KN';
	$page = preg_replace('/\n/','',file_get_contents($url));
	$withlevel = (preg_match('#keine Wasserstandsangaben#m',$page))? false : true;
	preg_match('#<table .*?>(.*?)</table>#mi',$page,$m);
	if (!$m) continue;
	$line = preg_replace('#<td.*?>#','|',$m[1]);
	$line= preg_replace('#<tr>#','',$line);
	$line= preg_replace('#</tr>#','',$line);
	$line= preg_replace('#</td>#','',$line);
	$line= preg_replace('# #','',$line);
	$line= preg_replace('#&nbsp;m#','',$line);
	$line= preg_replace('#\|\|#','|',$line);
	$parts = explode('|',$line);
	array_shift($parts);
	for ($p=0;$p<count($parts);$p++) {
		if ($withlevel) {
			$ndx = floor($p/5);
			if (@!$res[$i]->values[$ndx]) 
				$res[$i]->values[$ndx] = new stdClass();
			if ($p%5=='1') {$res[$i]->values[$ndx]->da = $parts[$p]; }
			if ($p%5=='2') $res[$i]->values[$ndx]->ty = $parts[$p]; 
			if ($p%5=='4') $res[$i]->values[$ndx]->m = $parts[$p]; 
			if ($p%5=='3') $res[$i]->values[$ndx]->da .= ' ' .$parts[$p];
		} else {
			$ndx = floor($p/4);
			if (@!$res[$i]->values[$ndx]) 
				$res[$i]->values[$ndx] = new stdClass();
			if ($p%4=='1') $res[$i]->values[$ndx]->da = $parts[$p]; 
			if ($p%4=='2') $res[$i]->values[$ndx]->ty = $parts[$p]; 
			if ($p%4=='3') $res[$i]->values[$ndx]->ti = $parts[$p]; 
		} 
	}
//	print_r ($parts);
	//echo "$line\n";	
	}file_put_contents('./tides.json',json_encode($res));
	$end = time();
$laufzeit = $end-$start;echo $laufzeit." sec.";


}