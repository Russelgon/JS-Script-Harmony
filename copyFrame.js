

function copyFrame() { //Функция контекстного меню

	window = new QWidget()
	layout = new QVBoxLayout()
	line = new QLineEdit()
	text = new QLabel(window)  // отвечает за получение текста для дальнейшей обработки
	button_s = new QPushButton("GO!)

	button_s.autoDefault = true

	layout.addWidget(text,0,Qt.AlignTop)
	layout.addWidget(line,1,Qt.AlignTop)
	layout.addWidget(button_s,2,Qt.AlignBottom)

	window.adjustSize() // подгоняет размеры окна под его содержимое
	window.setWindowTitle("Пошаговое продление кадра"); // название окна
	window.setGeometry(800,500,270,100) // создаём геометрию окна(х,у, ширина, высота). Х и У задаются относительно размеров экрана монитора
	window.setStyleSheet("font-size: 18px;background-color: qlineargradient( x1: 0, y1: 0, x2: 0, y2: 1,stop: 0.3 #5926f0, stop: 1 #26e2f0);")

	text.setText("Введите шаг:")
	text.setStyleSheet("padding:0px; color: #fff; font-size: 18px; background-color: #5926f0;")

	button_s.clicked.connect(this,modifyTimings)

	window.setLayout(layout) // всё что внутри вертикального виджета будет распологаться в окне
	window.show()
	
}

function modifyTimings() {

	scene.beginUndoRedoAccum("Переименование");

	sNode = selection.selectedNode(0);
	var useTiming = node.getAttr( sNode, 1, "drawing.elementMode" ).boolValue();
	drawColumn = node.linkedColumn( sNode, useTiming ? "drawing.element" : "drawing.customName.timing" );
	everyFrame= parseInt(this.line.text);
	previousEntry=NaN;

	for (i=0;i<frame.numberOf();i++){ // Цикл прохода по кадрам

		entry=parseInt(column.getEntry(drawColumn,1,i));

		if (entry && (!previousEntry) || ((entry-1)%everyFrame==0)){

			previousEntry=entry;
	}

		else if (entry && previousEntry!=NaN){

			column.setEntry(drawColumn, 1, i, previousEntry)
		}
	}
	scene.endUndoRedoAccum();
	
	this.window.close()
}
