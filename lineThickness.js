function lineThicknessMenu() { // Функция для отображения контекстного меню
	window = new QWidget();
	layout = new QVBoxLayout();
	interfaceLine = new QLineEdit();
	interfaceLineSecond = new QLineEdit();
	textForMin = new QLabel(window);  // отвечает за получение текста для дальнейшей обработки
	buttonMin= new QPushButton("Lets GO!");

	buttonMin.autoDefault = true;

	layout.addWidget(textForMin, 0, Qt.AlignTop);
	layout.addWidget(interfaceLine, 1, Qt.AlignTop);
	layout.addWidget(interfaceLineSecond, 4, Qt.AlignTop);
	layout.addWidget(buttonMin, 2, Qt.AlignBottom);

	window.adjustSize() // подгоняет размеры окна под его содержимое
	window.setWindowTitle("Покадровое изменение контура кисти"); // название окна
	window.setGeometry(800, 500, 300, 100) // создаём геометрию окна(х,у, ширина, высота). Х и У задаются относительно размеров экрана монитора
	window.setStyleSheet("font-size: 18px;background-color: qlineargradient( x1: 0, y1: 0, x2: 0, y2: 1,stop: 0.3 #5926f0, stop: 1 #26e2f0);")

	textForMin.setText("Введите начальное и конечное значение кисти:");
	textForMin.setStyleSheet("padding:0px; color: #fff; font-size: 18px; background-color: #5926f0;");
	
	// придали кнопке вид
	buttonMin.setStyleSheet("padding:10px; color: #fff; font-size: 14px;border: 1px none #080d45; border-radius: 18px;\
						background-color: qlineargradient( x1: 0, y1: 0, x2: 0, y2: 1,stop: 0 #d38aeb, stop: 1 #5926f0);\
						")
	buttonMin.pressed("color: #000");
	
	// придали окну для ввода текста вид
	interfaceLine.setStyleSheet("padding:10px; color: #fff; font-size: 14px;border: 1px solid #080d45; border-radius: 5px;\
						background-color: qlineargradient( x1: 0, y1: 0, x2: 0, y2: 1,stop: 0 #080d45, stop: 1 #210845);")
	interfaceLineSecond.setStyleSheet("padding:10px; color: #fff; font-size: 14px;border: 1px solid #080d45; border-radius: 5px;\
						background-color: qlineargradient( x1: 0, y1: 0, x2: 0, y2: 1,stop: 0 #080d45, stop: 1 #210845);")

	buttonMin.clicked.connect(this, lineThickness);
	
	window.setLayout(layout); // всё что внутри вертикального виджета будет распологаться в окне
	window.show();
} 

function lineThickness() { // Функция скрипта
	scene.beginUndoRedoAccum("convert");
	Action.perform("onActionChooseSelectTool()",""); // Действие - выбрать все в окне

	var columnName = selection.selectedNode(0); // Выбор нужного модуля с нодами
	var columnRealName = ""; // Задаем колонку
	var useTiming = node.getAttr( columnName, 1, "drawing.elementMode" ).boolValue();
	var minSize = parseFloat(this.interfaceLine.text); // записываем начальное значение кисточки (!= MinimumSize in Pencil selection)
	var maxSize =  parseFloat(this.interfaceLineSecond.text);// Записываем конечное значение кисточки (!= MaximumSize in Pencil selection)
	var selectedCell = selection.selectedCellFrame(0); // Записываем первый кадр (выбранный)
	
	for (i = 0; i <= frame.numberOf(); ++i){
		if (column.getDisplayName(column.getName(i)) == columnName){
			columnRealName=column.getName(i);
		}
	}

	columnRealName = node.linkedColumn(columnName, useTiming ? "drawing.element" : "drawing.customName.timing");
	var numFrames =  selection.numberOfFramesSelected();
 	entries={};
	
	for (i = selectedCell ;i <numFrames + selectedCell; i++){
			entry=column.getEntry(columnRealName, 1, i)
		if (entry) {
			entries[entry]=i;
			} 
		}
		Object.keys(entries).forEach(function(key){
		MessageLog.trace(key + " : " + entries[key]);
		});
		
	var uniqValues = Object.keys(entries).length; // Кол-во уникальных значений 	
	var baseLine = minSize; // Прiбaвка целого	
	step = (maxSize - minSize)/(uniqValues - 1); // Рассчет шага
	var values = [];	
	var values = Object.keys(entries).map(function(key){
   		return entries[key];
	});
	MessageLog.trace("Res: " +values)
	values.forEach(function(item){
		DrawingTools.setCurrentDrawingFromColumnName(columnRealName,item);
		Action.perform("selectAll()", "cameraView");
  		PenstyleManager.changeCurrentPenstyleMaximumSize(baseLine);
  		MessageLog.trace("frame: " + item + " size: " + baseLine + "step: " + step);
   		baseLine+= step;
		MessageLog.trace(item);
	});
	scene.endUndoRedoAccum();
	this.window.close();
}
