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
            
            new Panel("properties",{
                name:"Properties",
                icon:"build_circle",
                //menu:
            });
            
            new Mode("properties",{
                category: "navigate",
                default_tool: "move_tool",
                center_windows: ["preview"],
                selectCubes: true,
                component: {
                  data() {
                    return {
                      count: 0
                    }
                  },
                  template: `
                    <button @click="count++">
                      You clicked me {{ count }} times.
                    </button>`
                },
                condition: () => true,//need to change this so it only appears when working on designated m3we files
                onSelect: ()=>{},
                onUnselect: ()=>{}
            });
            Modes.vue.$forceUpdate()
        },
        onunload() {
            button.delete();
        }
  });
})();
