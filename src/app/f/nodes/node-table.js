/**
 * Created by yuriy on 1/30/14.
 */
angular.module('mapping-node-table', [])
    .factory('tableNode', function(canvas, model) {
        var layer = canvas.getLayer();

        var config = {
            field: {
                height: 15,
                width: 200,
                x: 10,
                y: 10,
                borderColor: '#489DAB',
                selectedShift: 4,
                borderWidth: 1
            },

            textName: {
                fontSize: 10,
//                fontColor: '#918F8A',
//                fontColor: '#00728D',
                fontColor: '#6E6851',
                padding: 4,
                idPrefix: 'fn-'
            },

            textType: {
                fontSize: 8,
//                fontColor: '#D1D1D1',
                fontColor: '#84817E',
                padding: 4,
                idPrefix: 'ft-'
            }
        };


        var drawField = function (order, field) {
            $ = this;

            var fieldRect = new Kinetic.Rect({
                x: config.field.x,
                y: (order - 1) * config.field.height + config.field.y,
                width: config.field.width,
                height: config.field.height,
                stroke: config.field.borderColor,
                strokeWidth: config.field.borderWidth,
                id: field.id
            });

            var fieldName = new Kinetic.Text({
                x: fieldRect.getX(),
                y: fieldRect.getY(),
                text: field.info.name,
                fontSize: config.textName.fontSize,
                fill: config.textName.fontColor,
                padding: config.textName.padding,
                id: config.textName.idPrefix + field.id
            });

            var fieldType = new Kinetic.Text({
                x: fieldRect.getX(),
                y: fieldRect.getY(),
                text: field.info.type,
                fontSize: config.textType.fontSize,
                fill: config.textType.fontColor,
                padding: config.textType.padding,
                align: 'right',
                width: config.field.width,
                id: config.textType.idPrefix + field.id
            });

            fieldRect.on('mouseover', function () {
                this.setStrokeWidth(config.field.borderWidth * 2);
                layer.draw();
            });

            fieldRect.on('mouseout', function () {
                this.setStrokeWidth(config.field.borderWidth);
                layer.draw();
            });

            fieldRect.on('click', function () {
                $.deselectCurrent();
                model.selectSourceField(this.getId());
                $.selectCurrent();
            });

            layer.add(fieldName);
            layer.add(fieldType);
            layer.add(fieldRect);
        };


        return {
            /**
             * Рисует таблицу
             * @param {object} table Корневой узел модели, который содержит наименование таблицы
             */
            draw: function(table) {
                config.field.x = table.view.position.x;
                config.field.y = table.view.position.y;

                for (var i = 0; i < table.children.length; i++) {
                    drawField(i+1, table.children[i]);
                }

                var fieldRect = new Kinetic.Rect({
                    x: config.field.x,
                    y: config.field.y - 18,
                    width: config.field.width,
                    height: 18,
                    stroke: config.field.borderColor,
                    strokeWidth: config.field.borderWidth,
                    fill: "#E3ECF1"
//                    fillLinearGradientStartPoint: {x:0, y:0},
//                    fillLinearGradientEndPoint: {x:config.field.width/2, y:0},
//                    fillLinearGradientColorStops: [0, 'BCEBF7', 1, 'E3ECF1']
//                    fillLinearGradientColorStops: [0, 'A9EBF7', 1, 'E3ECF1']
                });

                var fieldName = new Kinetic.Text({
                    x: fieldRect.getX(),
                    y: fieldRect.getY(),
                    text: table.info.name,
                    fontSize: 12,
                    fill: '#304081',
                    padding: config.textName.padding
                });


                layer.add(fieldRect);
                layer.add(fieldName);
                layer.draw();
            },


            /** Устанавливает выделение */
            selectCurrent: function () {
                model.getCurrent().sources.forEach(function (src) {
                    var fieldRect = stage.find('#' + src)[0];
                    var fieldName = stage.find('#' + config.textName.idPrefix + src)[0];
                    var fieldType = stage.find('#' + config.textType.idPrefix + src)[0];

                    fieldRect.setX(fieldRect.getX() + config.field.selectedShift);
                    fieldName.setX(fieldRect.getX());
                    fieldType.setX(fieldRect.getX());
                });

                layer.draw();
            },

            /** Снимает выделение */
            deselectCurrent: function () {
                model.getCurrent().sources.forEach(function (src) {
                    var fieldRect = stage.find('#' + src)[0];
                    var fieldName = stage.find('#' + config.textName.idPrefix + src)[0];
                    var fieldType = stage.find('#' + config.textType.idPrefix + src)[0];

                    fieldRect.setX(fieldRect.getX() - config.field.selectedShift);
                    fieldName.setX(fieldRect.getX());
                    fieldType.setX(fieldRect.getX());
                });

                layer.draw();
            }
        }
    });
