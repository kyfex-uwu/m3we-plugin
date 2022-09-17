(function() {
    var button;
    
    Plugin.register("m3we_plugin", {
        title: "M3WE Plugin",
        author: "KYFEX",
        description: "Tool for making M3WE asset creation even easier",
        icon: "build_circle",
        version: "0.0.0",
        variant: "both",
        onload() {
            button = new Action('randomize_height', {
                name: 'Randomize Height',
                description: 'Randomize the height of all selected elements',
                icon: 'bar_chart',
                click: function() {
                    Undo.initEdit({elements: Cube.selected});
                    Cube.selected.forEach(cube => {
                        cube.to[1] = cube.from[0] + Math.floor(Math.random()*8);
                    });
                    Undo.finishEdit('randomize cube height');
                }
            });
            MenuBar.addAction(button, 'filter');
            
            new Dialog({
                id: 'generate_tree',
                title: 'Tree Generator',
                form: {
                    branches: {label: 'Branches', type: 'number', value: 10, step: 1, min: 1, max: 16},
                    conifer: {label: 'Conifer', type: 'checkbox'},
                },
                onConfirm: function(formData) {
                    TreeGenerator.generateTree(formData.branches, formData.conifer)
                    this.hide()
                }
            }).show()
        },
        onunload() {
            button.delete();
        }
  });
})();
