(function() {
    var button;
    var propsPanel;
    
    Plugin.register("m3we-plugin", {
        title: "M3WE Plugin",
        author: "KYFEX",
        description: "Tool for making M3WE asset creation even easier",
        icon: "build_circle",
        version: "0.0.0",
        variant: "both",
        onload() {
            document.head.innerHTML+="<style>"+
            ".m3we-box{"+
            "background-color: var(--color-dark);"+
            "border: 1px solid var(--color-button);"+
            "</style>";

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
                        blockStates:0,

                        namespaceValidator:/[a-z0-9_.-]+/,
                        blockNameValidator:/[a-z0-9/._-]+/,
                    }},
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
                        addBlockState(parent){
                            let blockStateId=this.blockStates;
                            let newBlockState = document.createElement("li");
                            newBlockState.id="blockState"+blockStateId;
                            newBlockState.style="margin-left:12px;";
                            newBlockState.innerHTML=`
                                Blockstate <input class="m3we-box dark_bordered"
                                value="blockstate"
                                style="margin-right:5px;">
                            <ul style="margin-left:12px;">
                                <li>Type:<select name="defaultvalue" class="m3we-box dark_bordered">
                                    <option value="int">Integer</option>
                                    <option value="bool">Boolean</option>
                                    <option value="direction">Direction</option>
                                    <!--<option value="enum">Enum</option>-->
                                </select></li>
                                <li>Default Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                                <li integer>Max Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                                <li integer>Min Value:<input
                                    class="m3we-box dark_bordered" value="0"
                                ></li>
                            </ul>
                            `;

                            this.blockStates++;
                            parent.insertBefore(newBlockState, parent.children[this.properties.length]);
                        },
                    },
                    //tl("translation.path") translates text
                    template: `
                        <ul class="list mobile_scrollbar"
                            @contextmenu.stop.prevent="openMenu($event)">
                            <li v-for="(property,index) of properties">
                                <p v-if="property[1]!='checkbox'" style="display:flex;">
                                    {{propToReadable(property[0])}}:
                                    <input :id="'property'+index" class="m3we-box dark_bordered"
                                    :value="property[3]" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px; flex-grow: 1; flex-shrink: 1;">
                                </p>
                                <p v-else style="display:flex;">
                                    {{propToReadable(property[0])}}:
                                    <input :id="'property'+index" 
                                    :checked="property[3]?true:null" :type="property[1]"
                                    style="margin-left:5px; margin-right:5px;">
                                    <span v-if="property[2]=='boolOrScript'">{{property[3]?"ALWAYS":"NEVER"}}</span>
                                </p>
                            </li>
                            <br>
                            <li>
                            <button @click="addBlockState(_self.$el)">Add Blockstate</button>
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
                    propsPanel.vue.properties.forEach((propData, index)=>{
                        let currInput = document.getElementById("property"+index);
                        objToReturn[propData[0]]=currInput.value;
                        if(propData[1]=="checkbox") objToReturn[propData[0]]=currInput.checked;
                    });

                    let currBlockState=0;
                    let currBSElement;
                    while(currBSElement=document.getElementById("blockState"+currBlockState)){
                        if(currBlockState==0)
                            objToReturn.blockStates={};

                        let BSData=currBSElement.children[1].children;
                        let currBlockStateObj={
                            type:BSData[0].children[0].value,
                            default:BSData[1].children[0].value
                        };
                        if(currBlockStateObj.type=="int"){
                            currBlockStateObj.min=BSData[2].children[0].value;
                            currBlockStateObj.max=BSData[3].children[0].value;
                        }

                        objToReturn.blockStates[currBSElement.children[0].value]=currBlockStateObj;
                        currBlockState++;
                    }

                    objToReturn.createdBy="m3we_plugin";

                    //todo: add block collision

                    let a = document.createElement("a");
                    a.href = window.URL.createObjectURL(
                        new Blob([JSON.stringify(objToReturn,null,2)], {type: "text/plain"}));
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
