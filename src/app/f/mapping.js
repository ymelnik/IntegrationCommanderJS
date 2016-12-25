/**
 * Created by yuriy on 12/22/13.
 */
angular.module('mapping', ['mapping-model', 'mapping-canvas', 'mapping-node-xsd', 'mapping-node-table'])
    .run(function(canvas) {
        canvas.initCanvasContext();
    })

    .controller('MappingCtrl', function ($scope, renderingService) {
        $scope.mapping = {
            nodes: [
                /*
                 node types:
                 1 - xsd element
                 2 - xsd attribute
                 3 - database table
                 4 - database table field
                 */
                {
                    id: 1,
                    type: 1,
                    view: {
                        position: {
                            x: 100,
                            y: 100
                        }
                    },
                    info: {
                        name: 'Field-1',
                        type: 'xsd:string'
                    },
                    children: [
                        {
                            id: 2,
                            type: 1,
                            info: {
                                name: 'Field-1.1',
                                type: 'xsd:int'
                            }
                        },
                        {
                            id: 3,
                            type: 1,
                            info: {
                                name: 'Field-1.2',
                                type: 'xsd:string'
                            },
                            children: [
                                {
                                    id: 4,
                                    type: 1,
                                    info: {
                                        name: 'Field-1.2.1',
                                        type: 'xsd:boolean'
                                    }

                                }
                            ]
                        },
                        {
                            id: 5,
                            type: 1,
                            info: {
                                name: 'Field-1.3',
                                type: 'xsd:string'
                            }
                        }
                    ]
                },
                {
                    id: 6,
                    type: 1,
                    view: {
                        position: {
                            x: 100,
                            y: 100
                        }
                    },
                    info: {
                        name: 'Field-2',
                        type: 'xsd:string'
                    },
                    children: [
                        {
                            id: 7,
                            type: 1,
                            info: {
                                name: 'Field-2.1',
                                type: 'xsd:int'
                            }
                        },
                        {
                            id: 8,
                            type: 1,
                            info: {
                                name: 'Field-2.2',
                                type: 'xsd:string'
                            },
                            children: [
                                {
                                    id: 9,
                                    type: 1,
                                    info: {
                                        name: 'Field-2.2.1',
                                        type: 'xsd:boolean'
                                    }

                                }
                            ]
                        },
                        {
                            id: 10,
                            type: 1,
                            info: {
                                name: 'Field-2.3',
                                type: 'xsd:string'
                            }
                        }
                    ]
                },
                {
                    id: 11,
                    type: 3,
                    view: {
                        position: {
                            x: 500,
                            y: 100
                        }
                    },
                    info: {
                        name: 'TEST_TABLE'
                    },
                    children: [
                        {
                            id: 12,
                            type: 4,
                            info: {
                                name: 'ID',
                                type: 'NUMBER (19,0)'
                            }
                        },
                        {
                            id: 13,
                            type: 4,
                            info: {
                                name: 'CUSTOMER_NAME',
                                type: 'VARCHAR2(50 CHAR)'
                            }
                        },
                        {
                            id: 14,
                            type: 4,
                            info: {
                                name: 'FULL_ADDRESS',
                                type: 'VARCHAR2(255 CHAR)'
                            }
                        }
                    ]
                }
            ],
            edges: [
            ]
        };

        $scope.openMapping = function () {
            renderingService.draw($scope.mapping);
        }
    })

    .factory('renderingService', function (xsdNode, tableNode) {
        return {
            draw: function (model) {
                model.nodes.forEach(function (node) {
                    if (node.type === 1) {
                        xsdNode.draw(node);

                    } else if (node.type === 3) {
                        tableNode.draw(node);
                    }
                });

            }
        }
    });