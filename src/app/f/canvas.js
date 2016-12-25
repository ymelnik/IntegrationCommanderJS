/**
 * Created by yuriy on 1/28/14.
 */
angular.module('mapping-canvas', [])
    .provider('canvas', function () {
        return {
            $get: function (model) {
                var $;

                return {
                    initCanvasContext: function () {
                        $ = this;

                        stage = new Kinetic.Stage({
                            container: 'mappingCanvas',
                            width: window.innerWidth,
                            height: window.innerHeight
                        });


                        var background = new Kinetic.Rect({
                            x: 0,
                            y: 0,
                            width: stage.getWidth(),
                            height: stage.getHeight()
                        });

                        background.on('click', function () {
                            $.stopDrawEdge();
                            layer.draw();
                        });

                        background.on('mousemove', function (evt) {
                            /*
                             Если идёт процесс протягивания ребра, то при ведении курсора мыши по свободной области,
                             за ним тащится свободный конец нитки
                             */
                            if ($.isEdgeDrawingNow()) {
                                var absolutePosition = model.getDrawingEdge().from.arrow.getAbsolutePosition();
                                model.getDrawingEdge().line.getPoints()[2] = evt.layerX - 0.5;
                                model.getDrawingEdge().line.getPoints()[3] = evt.layerY - 0.5;

                                layer.draw();
                            }
                        });

                        background.on('mouseout', function () {
                            /*
                             Если идёт процесс протягивания ребра и курсор мыши покинул свободную область, то
                             нарисованная нитка исчезает
                            */
                            if ($.isEdgeDrawingNow()) {
                                model.getDrawingEdge().line.getPoints().splice(2);
                                layer.draw();
                            }
                        });

                        layer = new Kinetic.Layer();
                        layer.add(background);

                        stage.add(layer);
                    },


                    getLayer: function () {
                        return layer;
                    },


                    getStage: function () {
                        return stage;
                    },


                    /**
                     * Функция должна вызываться при начале рисования ребра.
                     * @param elementText Элемент источник
                     */
                    startDrawEdge: function (elementText) {
                        this.stopDrawEdge();

                        model.getDrawingEdge().from = elementText;

                        var absolutePosition = elementText.arrow.getAbsolutePosition();
                        model.getDrawingEdge().line.getPoints()[0] = elementText.arrow.getPoints()[2] + absolutePosition.x;
                        model.getDrawingEdge().line.getPoints()[1] = elementText.arrow.getPoints()[3] + absolutePosition.y;

                        layer.add(model.getDrawingEdge().line);
                    },


                    stopDrawEdge: function () {
                        if (this.isEdgeDrawingNow()) {
                            var drawingEdge = model.getDrawingEdge();
                            if (!model.findTargetEdgesForNode(drawingEdge.from.getId())) {
                                /*
                                  Если из исходящего элемента рисуемого ребра нет других исходящих рёбер, то у этого
                                  элемента удаляем стрелку
                                 */
                                drawingEdge.from.arrow.remove();
                                drawingEdge.from.arrow = undefined;
                            }

                            drawingEdge.from = undefined;
                            drawingEdge.to = undefined;

                            drawingEdge.line.getPoints().splice(0);
                            drawingEdge.line.remove();
                        }
                    },


                    isEdgeDrawingNow: function() {
                        return model.getDrawingEdge().from !== undefined;
                    }
                }
            }
        }
    });
