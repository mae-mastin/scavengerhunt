const MAP_SIZE = 500
const NU_CENTER = ol.proj.fromLonLat([-87.6753, 42.056])

const AUTOMOVE_SPEED = 1
const UPDATE_RATE = 100

let landmarkCount = 0
let clueIndex = 1
let clueList = [["Placeholder clue for The Rock", 0]]
clueMessage = clueList[0][0]


let gameState = {
	points: 0,
	captured: [],
	messages: "Clue: " + clueMessage,
}

let map = new InteractiveMap({
	mapCenter: NU_CENTER,

	ranges: [500, 200, 90, 1],

	initializeMap() {
		this.loadLandmarks("landmarks-scavenger-hunt", (landmark) => {
			return true
    })
	},

	update() {
	},

	initializeLandmark: (landmark, isPlayer) => {
		if (landmark.openMapData) {
			landmark.name = landmark.openMapData.name
		}
		landmark.idNumber = landmarkCount++
    if (!landmark.idNumber == 0) {
      clueList.push([landmark.name, landmark.idNumber])
    }
    return landmark
	}, 

	onEnterRange: (landmark, newLevel, oldLevel, dist) => {
		console.log("enter", landmark.name, newLevel)
		if (newLevel == 2) {
			if (!gameState.captured.includes(landmark.name) && landmark.idNumber == clueIndex) {
        gameState.points += landmark.points
        clueIndex++
        gameState.messages = "Placeholder clue for " + clueList[clueIndex][0]
				gameState.captured.push(landmark.name)
			}
		}
	},

	onExitRange: (landmark, newLevel, oldLevel, dist) => {
		console.log("exit", landmark.name, newLevel)
	},
	
	featureToStyle: (landmark) => {
		if (landmark.isPlayer) {
			return {
				icon: "person_pin_circle",
				noBG: true 
			}
		}
    let hue = landmark.idNumber*30
    console.log(hue)
		return {
			label: landmark.name + "\n" + landmark.distanceToPlayer +"m",
			fontSize: 8,
			icon: "person_pin_circle",
      iconColor: [hue, .5, .6],
			bgColor: [hue, 1, .2],
			noBG: true 
		}
	},
})

window.onload = (event) => {
	const app = new Vue({
		template: `
		<div id="app">
		<header></header>
			<div id="main-columns">
				<div class="main-column" style="flex:1;overflow:scroll;max-height:200px">
					{{gameState.messages}} <br> You already found: {{gameState.captured}} 
				</div>
				<div class="main-column" style="overflow:hidden;width:${MAP_SIZE}px;height:${MAP_SIZE}px">
					<location-widget :map="map" />
				</div>
			</div>	
		<footer></footer>
		</div>`,
		data() {
			return {
				map: map,
				gameState: gameState
			}
		},
		components: Object.assign({
			"location-widget": locationWidget,
		}),
		el: "#app"
	})
};