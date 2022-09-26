(function() {
    var button;
    var propsPanel;
    
    Plugin.register("m3we_plugin", {
        title: "M3WE Plugin",
        author: "KYFEX",
        description: "Tool for making M3WE asset creation even easier",
        icon: "build_circle",
        version: "0.0.0",
        variant: "both",
        onload() {
            
            propsPanel=new Panel("properties",{
                icon:"build_circle",
                condition: {modes: ["properties"]},
                default_position: {
                    slot: 'left_bar',
                    float_position: [0, 0],
                    float_size: [300, 400],
                    height: 400
                },
                growable:true,
                component: {
                    name: 'panel-display',
                    data() {return {
                        properties:[
                            ["namespace","text","namespace","m3we"],
                            ["blockName","text","blockName","name"],
                            ["material","text","material","STONE"],//enum
                            ["hardness","number","float",0.0],
                            ["resistance","number","float",0.0],
                            ["slipperiness","number","float",0.6],
                            ["jumpMultiplier","number","float",1.0],
                            ["speedMultiplier","number","float",1.0],
                            ["sounds","text","sound","STONE"],//enum
                            ["isOpaque","checkbox","bool",true],
                            ["luminance","number","integer", 0],//or script
                            ["mapColor","text","mapColor","CLEAR"],//enum
                            ["drops","text","dropTable","EMPTY"],//enum
                            ["isToolRequired","checkbox","bool",false],
                            ["ticksRandomly","checkbox","bool",false],
                            ["isAir","checkbox","bool",false],
                            ["isCollidable","checkbox","bool",true],
                            ["blockCollisionCanResize","checkbox","bool",false],
                            ["isSolidWhen","checkbox","boolOrScript", true],//or script
                            ["allowsSpawningWhen","checkbox","boolOrScript", true],//or script
                            ["visionBlockedWhen","checkbox","boolOrScript", false],//or script
                            ["suffocatesWhen","checkbox","boolOrScript", false],//or script
                            ["emissiveLightingWhen","checkbox","boolOrScript", false],//or script
                            ["postProcessWhen","checkbox","boolOrScript", false],//or script*/
                        ],

                        namespaceValidator:/[a-z0-9_.-]+/,
                        blockNameValidator:/[a-z0-9/._-]+/,
                    }},
                    watch: {
                        //data variable name, whenever the variable changes this func will run (newvalue, oldvalue)
                    },
                    methods: {
                        propToReadable(text){
                            let toReturn=text[0].toUpperCase();
                            for(let i=1;i<text.length;i++){
                                if(text[i]!=text[i].toUpperCase()&&text[i]==text[i].toLowerCase()){//is lowercase
                                    toReturn+=text[i];
                                }else{//is uppercase
                                    toReturn+=" "+text[i];
                                }
                            }
                            return toReturn;
                        },
                        updateProp(parent,index){
                            let value=parent.children[index].children[0].children[0].value;
                            let propType;
                            switch(propType=parent.children[index].getAttribute("proptype")){
                                case "namespace":
                                    this.properties[index][3]=this.namespaceValidator.match(value)[0];
                                    break;
                                case "blockName":
                                    this.properties[index][3]=this.blockNameValidator.match(value)[0];
                                    break;
                                case "material":
                                case "sound":
                                case "mapColor":
                                case "dropTable":
                                    this.properties[index][3]=value;
                                    break;
                                case "integer":
                                    this.properties[index][3]=parseInt(value);
                                    break;
                                case "boolOrScript":
                                case "bool":
                                    value=parent.children[index].children[0].children[0].checked;
                                    this.properties[index][3]=value;
                                    if(propType=="boolOrScript")
                                        parent.children[index].children[0].children[1].innerText=
                                            (value?"ALWAYS":"NEVER");
                                    break;
                                    
                            }
                        },
                    },
                    //tl("translation.path") translates text
                    template: `
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li v-for="(property,index) of properties" :proptype=property[2]>
                                <p v-if="property[1]!='checkbox'" style="display:flex;">
                                    {{propToReadable(property[0])}}:
                                    <input :id="'property'+index" class="dark_bordered"
                                    :value="property[3]" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px; flex-grow: 1; flex-shrink: 1;"
                                    @input="updateProp(_self.$el,index)">
                                </p>
                                <p v-else style="display:flex;">
                                    {{propToReadable(property[0])}}:
                                    <input :id="'property'+index" 
                                    :checked="property[3]?true:null" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px;"
                                    @input="updateProp(_self.$el,index)">
                                    <span v-if="property[2]=='boolOrScript'">{{property[3]?"ALWAYS":"NEVER"}}</span>
                                </p>
                            </li>
                        </ul>
                    `
                },
            });

            button = new Action('m3we_export', {
                name: 'Export M3WE Block',
                description: 'Export an M3WE block',
                icon: 'settings_input_component',
                click: function() {
                    let objToReturn={};
                    propsPanel.vue.properties.forEach((propData)=>{
                        objToReturn[propData[0]]=propData[3];
                    });
                    objToReturn["createdBy"]="m3we_plugin";

                    //todo: add block collision

                    let a = document.createElement("a");
                    a.href = window.URL.createObjectURL(
                        new Blob(JSON.stringify(objToReturn,null,2), {type: "text/plain"}));
                    a.download = objToReturn.blockName+".json";
                    a.click();
                }
            });
            MenuBar.addAction(button, 'file.export.0');

            
            new Mode("properties",{
                name:"Properties",
                category: "navigate",
                default_tool: "move_tool",
                center_windows: ["properties"],
                selectCubes: false,
                component: {
                    data() {
                        return {

                        }
                    },
                    template: ``
                },
                condition: () => true,//need to change this so it only appears when working on designated m3we files
                onSelect: ()=>{},
                onUnselect: ()=>{}
            });
            Modes.vue.$forceUpdate();
        },
        onunload() {
            //uninstall
        }
  });
})();


new Panel('outliner', {
        growable: true,
        component: {
            name: 'panel-outliner',
            template: `
                <ul id="cubes_list"
                    class="list mobile_scrollbar"
                    @contextmenu.stop.prevent="openMenu($event)"
                    @mousedown="dragNode($event)"
                    @touchstart="dragNode($event)"
                >
                    <vue-tree-item v-for="item in root" :node="item" :options="options" :key="item.uuid"></vue-tree-item>
                </ul>
            `
        },
    })
