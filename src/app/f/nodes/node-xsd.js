/**
 * Created by yuriy on 1/28/14.
 */
angular.module('mapping-node-xsd', [])
    .factory('xsdNode', function (canvas, model) {
        var layer = canvas.getLayer();

        var config = {
            border: {
                x: 93,
                y: 100,
                width: 100,
                bottomSpace: 4,
                rowHeight: 15,
                color: '#489DAB',
                lineWidth: 1
            },

            textName: {
                x: 100,
                y: 100,
                fontSize: 10,
                fontColor: '#785544',
                padding: 4,
                idPrefix: 'el-',
                height: 15,
                shiftSpace: 10,
                lineColor: '#D9D9D9',
                lineWidth: 1
            }
        };

        var selectedElement;


        /**
         * Рекурсивно рисует все элементы xsd
         *
         * @param {object} element При первом вызове передаётся корневой элемент модели, затем рекурсивно передаются дочерние элементы
         * @param {Kinetic.Group} group Группа, объединяющая все графические элементы, отображающие XSD
         * @param {int} [order = 1] Порядковый номер элемента
         * @param {int} [shift = 0] Смещение дочернего элемента относительного корневого
         * @param {object} [root = @element] Корневой элемент модели
         *
         * @returns {int} Количество элементов в xsd. Фактически количество нарисованных строк
         */
        var drawXSD = function (element, group, order, shift, root) {
            order = typeof order !== 'undefined' ? order : 1;
            shift = typeof shift !== 'undefined' ? shift : 0;
            root = typeof root !== 'undefined' ? root : element;

            drawElement(order++, element, shift, root, group);
            if (element.children) {
                shift++;
                for (var i = 0; i < element.children.length; i++) {
                    order = drawXSD(element.children[i], group, order, shift, root);
                }
            }

            return order;
        };


        /**
         * Рисует элемент XSD
         *
         * @param {int} order Порядковый номер элемента
         * @param {object} element Элемент из модели, которы необходимо нарисовать
         * @param {int} shift Сдвиг относительно корневого элемента
         * @param {object} root Корневой элемент модели
         * @param {Kinetic.Group} group Группа, объединяющая все графические элементы, отображающие XSD
         */
        var drawElement = function (order, element, shift, root, group) {
            for (var i = 0; i < shift; i++) {
                var line = new Kinetic.Line({
                    points: [
                        config.textName.x + config.textName.padding + 1 + config.textName.shiftSpace * i,
                        (order - 1) * config.textName.height + config.textName.y,
                        config.textName.x + config.textName.padding + 1 + config.textName.shiftSpace * i,
                        (order - 1) * config.textName.height + config.textName.y + config.textName.height
                    ],
                    stroke: config.textName.lineColor,
                    strokeWidth: config.textName.lineWidth
                });
                group.add(line);
            }

            var elementText = new Kinetic.Text({
                x: config.textName.x + config.textName.shiftSpace * shift,
                y: (order - 1) * config.textName.height + config.textName.y,
                text: element.info.name,
                fontSize: config.textName.fontSize,
                fill: config.textName.fontColor,
                padding: config.textName.padding,
                id: element.id
            });

            elementText.root = root;

            elementText.on('click', function () {
                if (canvas.isEdgeDrawingNow()) {
                    if (model.getDrawingEdge().from.getParent() === elementText.getParent()) {
                        if (elementText.arrow === undefined) {
                            elementText.arrow = createOutboundArrow(elementText);
                            group.add(elementText.arrow);
                        }

                        canvas.startDrawEdge(elementText);

                    } else {
                        model.getDrawingEdge().to = elementText;
                        model.addEdge(model.getDrawingEdge().from.getId(), model.getDrawingEdge().to.getId());

                        if (elementText.arrow === undefined) {
                            elementText.arrow = createInboundArrow(elementText);
                            group.add(elementText.arrow);
                        }
                        canvas.stopDrawEdge();
                    }

                } else {
                    if (elementText.arrow === undefined) {
                        elementText.arrow = createOutboundArrow(elementText);
                        group.add(elementText.arrow);
                    }
                    canvas.startDrawEdge(elementText);
                }

                changeSelectedElement(elementText);
                layer.draw();
            });

            elementText.on('mouseover', function () {
                this.setShadowColor('#EF724F');
                this.setShadowOpacity(1);

                layer.draw();
            });

            elementText.on('mouseout', function () {
                this.setShadowOpacity(0);

                layer.draw();
            });

            group.add(elementText);
        };


        /**
         * Рисует рамку XSD
         *
         * @param {int} elementCount Количество элементов в XSD для отпределения высоты рамки
         * @param {Kinetic.Group} group Группа, объединяющая все графические элементы, отображающие XSD
         */
        var drawBorder = function (elementCount, group) {
            var borderRect = new Kinetic.Rect({
                x: config.border.x,
                y: config.border.y,
                width: config.border.width,
                height: elementCount * config.textName.height + config.border.bottomSpace,
                stroke: config.border.color,
                strokeWidth: config.border.lineWidth
            });

            group.add(borderRect);

            borderRect.moveToBottom();
        };


        /**
         * Рисует входящую стрелку
         *
         * @param {Kinetic.Text} elementText Элемент
         *
         * @return {Kinetic.Line} Нарисованная входящая стрелка
         *
         * @typedef {object} Kinetic.Text
         * @typedef {object} Kinetic.Line
         */
        var createInboundArrow = function (elementText) {
            return new Kinetic.Line({
                points: [
                    config.border.x, elementText.getY() + config.textName.height / 2 - 4,
                    config.border.x + 5, elementText.getY() + config.textName.height / 2,
                    config.border.x, elementText.getY() + config.textName.height / 2 + 4
                ],
                stroke: config.border.color,
                strokeWidth: config.border.lineWidth
            });
        };


        /**
         * Рисует исходящую стрелку
         *
         * @param {Kinetic.Text} elementText Элемент
         *
         * @return {Kinetic.Line} Нарисованная входящая стрелка
         *
         * @typedef {object} Kinetic.Text
         * @typedef {object} Kinetic.Line
         */
        var createOutboundArrow = function (elementText) {
            return new Kinetic.Line({
                points: [
                    config.border.x + config.border.width, elementText.getY() + config.textName.height / 2 - 4,
                    config.border.x + config.border.width + 5, elementText.getY() + config.textName.height / 2,
                    config.border.x + config.border.width, elementText.getY() + config.textName.height / 2 + 4
                ],
                stroke: config.border.color,
                strokeWidth: config.border.lineWidth
            });
        };


        /**
         * Устанавливает текущий выделенный элемент
         * @param elementText Элемент, который станет текущим выделенным
         */
        var changeSelectedElement = function (elementText) {
            if (selectedElement !== undefined) {
                doSelectionOfElement(selectedElement, false);
            }

            selectedElement = elementText;
            doSelectionOfElement(elementText, true);
        };


        /**
         * Выделяет или снимает выделение с переданного элемента и входящих/исходящих рёбер в случае их наличия
         * @param {Kinetic.Text} elementText Элемент
         * @param {boolean} selecting Флаг, производится выделение или снятие выделеления. True - элемент выделяется
         */
        var doSelectionOfElement = function (elementText, selecting) {
            var sourceEdge = model.findSourceEdgeForNode(elementText.getId());
            var targetEdges = model.findTargetEdgesForNode(elementText.getId());
            var color = selecting ? 'black' : '#D9D9D9';

            var fontStyle = selecting ? 'bold italic' : 'normal';
            elementText.setFontStyle(fontStyle);

            if (sourceEdge !== undefined) {
                /* Изменение шрифта узла */
                var srcElement = canvas.getStage().find('#' + sourceEdge)[0];
                srcElement.setFontStyle(fontStyle);

                /* Изменение начертания ребра */
                var lineSrc = canvas.getStage().find('#' + sourceEdge + '-' + elementText.getId())[0];

                if (lineSrc === undefined) {
                    var src = canvas.getStage().find('#' + sourceEdge)[0];
                    var trg = canvas.getStage().find('#' + elementText.getId())[0];
                    lineSrc = new Kinetic.Line({
                        points: [
                            src.arrow.getPoints()[2] + src.arrow.getAbsolutePosition().x,
                            src.arrow.getPoints()[3] + src.arrow.getAbsolutePosition().y,
                            trg.arrow.getPoints()[2] - 5 - 10 + trg.arrow.getAbsolutePosition().x,
                            trg.arrow.getPoints()[3] + trg.arrow.getAbsolutePosition().y,
                            trg.arrow.getPoints()[2] - 5 + trg.arrow.getAbsolutePosition().x,
                            trg.arrow.getPoints()[3] + trg.arrow.getAbsolutePosition().y
                        ],
                        stroke: color,
                        strokeWidth: 1,
                        id: sourceEdge + '-' + elementText.getId()
                    });

                    canvas.getLayer().add(lineSrc);

                } else {
                    lineSrc.setStroke(color);
                }

                selecting ? lineSrc.moveToTop() : lineSrc.moveToBottom();
            }

            if (targetEdges !== undefined) {
                for (var i = 0; i < targetEdges.length; i++) {
                    /* Изменение шрифта узла */
                    var trgElement = canvas.getStage().find('#' + targetEdges[i])[0];
                    trgElement.setFontStyle(fontStyle);

                    /* Изменение начертания ребра */
                    var lineTrg = canvas.getStage().find('#' + elementText.getId() + '-' + targetEdges[i])[0];
                    if (lineTrg !== undefined) {
                        lineTrg.setStroke(color);
                        selecting ? lineTrg.moveToTop() : lineTrg.moveToBottom();
                    }
                }
            }

            canvas.getLayer().draw();
        };


        return {
            /**
             * Рисует XSD
             * @param {object} rootNode Корневой узел модели
             */
            draw: function (rootNode) {
                var group = new Kinetic.Group({
                    draggable: true
                });

                group.on('mousemove', function (evt) {
                    var currentEdge = model.getDrawingEdge();

                    if (canvas.isEdgeDrawingNow() && currentEdge.from.getParent() !== group) {
                        var absolutePosition = currentEdge.from.arrow.getAbsolutePosition();
                        currentEdge.line.getPoints()[0] = currentEdge.from.arrow.getPoints()[2] + absolutePosition.x;
                        currentEdge.line.getPoints()[1] = currentEdge.from.arrow.getPoints()[3] + absolutePosition.y;
                        currentEdge.line.getPoints()[2] = config.border.x - 10 + group.getX();
                        currentEdge.line.getPoints()[3] = evt.layerY - 0.5;
                        currentEdge.line.getPoints()[4] = config.border.x + group.getX();
                        currentEdge.line.getPoints()[5] = evt.layerY - 0.5;
                        layer.draw();
                    }
                });

                /**
                 * Если при выходе курсора из ноды рисовалось ребро, то из массива точек "нитки" убирается точка изгиба
                 * нитки при входе в ноду
                 */
                group.on('mouseout', function () {
                    if (canvas.isEdgeDrawingNow()) {
                        model.getDrawingEdge().line.getPoints().splice(4, 2);
                    }
                });


                group.on('dragstart dragmove', function () {
                    var children = group.get('Text');

                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];

                        /* Перерисовка входящих рёбер */
                        var src = model.findSourceEdgeForNode(child.getId());

                        if (src !== undefined) {
                            var srcLine = canvas.getStage().find('#' + src + '-' + child.getId())[0];

                            srcLine.getPoints()[2] = child.arrow.getPoints()[2] - 5 - 10 + child.arrow.getAbsolutePosition().x;
                            srcLine.getPoints()[3] = child.arrow.getPoints()[3] + child.arrow.getAbsolutePosition().y;
                            srcLine.getPoints()[4] = child.arrow.getPoints()[2] - 5 + child.arrow.getAbsolutePosition().x;
                            srcLine.getPoints()[5] = child.arrow.getPoints()[3] + child.arrow.getAbsolutePosition().y;
                        }

                        /* Перерисовка исходящих рёбер */
                        var trg = model.findTargetEdgesForNode(child.getId());
                        if (trg !== undefined) {
                            for (var j = 0; j < trg.length; j++) {
                                var trgLine = canvas.getStage().find('#' + child.getId() + '-' + trg[j])[0];

                                trgLine.getPoints()[0] = child.arrow.getPoints()[2] + child.arrow.getAbsolutePosition().x;
                                trgLine.getPoints()[1] = child.arrow.getPoints()[3] + child.arrow.getAbsolutePosition().y;
                            }
                        }
                    }
                });

                var elementCount = drawXSD(rootNode, group);
                drawBorder(elementCount - 1, group);

                layer.add(group);
                layer.draw();
            }
        }
    });
