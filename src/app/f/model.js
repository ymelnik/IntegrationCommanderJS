/**
 * Created by yuriy on 1/26/14.
 */
angular.module('mapping-model', [])
    .provider('model', function () {
        /**
         * Ребро, которое рисуется в настоящий момент.
         * Если в настоящий момент ребро не рисуется, то <code>from</code> и <code>to</code> будут <code>undefined</code>
         */
        var drawingEdge = {
            /* Рисуемая линия */
            line: new Kinetic.Line({
                points: [],
                stroke: '#D9D9D9',
                strokeWidth: 1,
                dash: [2, 2]
            }),

            /* Объект KineticJS из которого выходит рисуемое ребро */
            from: undefined,

            /* Объект KineticJS в которой входит рисуемое ребро */
            to: undefined
        };

        /** Массив связей узла с узлами, из которых в него идут рёбра */
        var sourceEdges = {};

        /** Массив связей узла с узлами, в которые из этой него идут рёбра */
        var targetEdges = {};

        /**
         * Проверяет входит ли поле в текущую выбранную трансформацию
         * @param {string} fieldId
         */
        var isSourceInCurrent = function (fieldId) {
            var exist = false;
            current.sources.forEach(function (srcField) {
                exist = srcField == fieldId;
            });

            return exist;
        };

        return {
            $get: function () {
                return {
                    getCurrent: function () {
                        return current;
                    },


                    /**
                     * Находит узлы, в которые идут рёбра из заданного узла
                     * @param {int} nodeId Идентификатор узла
                     *
                     * @return {Array} Массив идентификаторов узлов, для которых заданный узел является источником
                     */
                    findTargetEdgesForNode: function (nodeId) {
                        return targetEdges[nodeId];
                    },


                    /**
                     * Находит ноды, в которые идут рёбра из заданной ноды
                     * @param {int} nodeId Идентификатор ноды
                     * @return {int} Идентификатор узла, который является источником для текущего или <code>undefined</code>
                     */
                    findSourceEdgeForNode: function (nodeId) {
                        return sourceEdges[nodeId];
                    },


                    /**
                     * Добавляет ребро в {@link targetEdges} и {@link sourceEdges}
                     * @param {int} sourceNode Узел-источник
                     * @param {int} targetNode Узел-приёмник
                     */
                    addEdge: function (sourceNode, targetNode) {
                        if (!(sourceNode in targetEdges)) {
                            targetEdges[sourceNode] = [];
                        }

                        if (!(targetNode in sourceEdges)) {
                            sourceEdges[targetNode] = [];
                        }

                        targetEdges[sourceNode].push(targetNode);
                        sourceEdges[targetNode] = sourceNode;
                    },


                    getDrawingEdge: function() {
                        return drawingEdge;
                    },


                    selectSourceField: function (fieldId) {
                        if (!isSourceInCurrent(fieldId)) {
                            current.sources = [];
                            current.sources.push(fieldId);
                        }

                    }
                }
            }
        }
    });
