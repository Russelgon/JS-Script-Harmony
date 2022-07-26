function grayScaleMov(  ) { // Функция переноса в папку

	var currentScene = scene.currentScene();
	var currentProjectPath = scene.currentProjectPathRemapped();
	var currentResolutionX = scene.currentResolutionX();
	var currentResolutionY = scene.currentResolutionY();
	var numberOf = frame.numberOf();

	MessageLog.trace(currentScene);	
	MessageLog.trace(currentProjectPath);	
	MessageLog.trace(currentResolutionX);	
	MessageLog.trace(currentResolutionY);	
	MessageLog.trace(numberOf);	

	originalName=scene.currentScene();
	movname= IsMovExists(currentScene);
	tempFile = currentProjectPath + "/" + movname + ".mov";

	exporter.exportToQuicktime("Display", 1, numberOf, 1, currentResolutionX, currentResolutionY, tempFile, "Display", false, 1);
	MessageLog.trace(node.deleteNode("Top/GreyscaleNew", false,false));

}

function IsMovExists(newname) {

	MessageLog.trace(node.type("Top/Composite_5"));
	var stringForCompositeNode = "";
	MessageLog.trace("pop: " +node.srcNode("Top/Display",0));
	stringForCompositeNode = node.srcNode("Top/Display",0); // Записываем верхнее значение от ноды Дисплей
	MessageLog.trace(stringForCompositeNode);

	if (node.type(stringForCompositeNode) == "COMPOSITE") {

	greyScaleNode = node.add( node.parentNode(stringForCompositeNode), "GreyscaleNew", "COLOR2BW", 0, 0, 0); // Создает ноду ГрейСкейл
	node.unlink("Top/Display", 0); // Отсоеденить Дисплей
	node.link(stringForCompositeNode, 0, greyScaleNode, 0); // Соеденить Композит и ГрейСкейл
	node.link(greyScaleNode, 0, "Top/Display",0); // Соеденить ГрейСкейл и Дисплей
	
}
	var i=0;
	var file = new File( scene.currentProjectPathRemapped() + "/" + newname + ".mov");
	var movname=newname;

	while (true){
		if (!file.exists){
			return movname;
		}
		else{
			movname=newname + "_" + ++ i;
			file = new File( scene.currentProjectPathRemapped() + "/" + movname + ".mov");
		}
	}
}