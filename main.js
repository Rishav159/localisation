var vpHeight,vpWidth;


let obsProbMatrix = {
    door : {
        obs_door : 0.99,
        obs_wall : 0.01
    },
    wall : {
        obs_door : 0.01,
        obs_wall : 0.99
    }
}
let moveProbMatrix = {
    right : {
        "1" : 0.9,
        "0" : 0.05,
        "2" : 0.03,
        "random" : 0.02
    },
    left : {
        "-1" : 0.9,
        "0" : 0.05,
        "-2" : 0.03,
        "random" : 0.02
    }
}



function getRadius(circumference) {
    return circumference/(2*Math.PI);
}

function getCircumference(radius) {
    return 2 * Math.PI * radius;
}

class Obstacle {
    constructor(config) {
        this.centerX = config.centerX;
        this.centerY = config.centerY;
        this.radius = config.radius;
        this.index = config.index;
        this.totalParts = config.parts;
        this.isDoor = config.isDoor;
        this.ele = config.ele;
        this.type = config.type;

        this.theta = this.index*(2*Math.PI/this.totalParts); 
        this.x = this.centerX 
        this.y = this.centerY - this.radius;
        this.circumference = getCircumference(this.radius);
        this.length = this.circumference/this.totalParts - 2;
        this.degreeTheta = this.theta*180 / Math.PI;
    }
    draw() {
        this.ele.append("path")
             .attr("d", "M"+this.x+" "+this.y+" a "+this.radius+" "+this.radius+" 0 0 1 0 "+(this.radius*2)+" a "+this.radius+" "+this.radius+" 0 0 1 0 "+(this.radius*(-2)))
             .attr("fill","none")
             .attr("stroke",this.type === "door"?"#DEB887":"gray")
             .attr("stroke-width", 20)
             .attr("stroke-dasharray",this.length+","+(this.circumference-this.length))
             .attr("transform" , "rotate("+this.degreeTheta+","+this.centerX+","+this.centerY+")")
             .attr("class", "obstacle c"+this.index);
    }
}

class Bar {
    constructor(config) {
        this.totalParts = config.parts;
        this.index = config.index;
        this.centerX = config.centerX;
        this.centerY = config.centerY;
        this.radius = config.radius;
        this.ele = config.ele;
        this.value = config.value || 0;

        this.theta = this.index*(2*Math.PI/this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = this.theta*180 / Math.PI;
        this.width = 30;
        this.maxHeight = 50;
        this.height = this.maxHeight * this.value;
        this.x = this.centerX;
        this.y = this.centerY;
    }

    draw() {
        this.barWrapper = this.ele.append("g")
            .attr("class","barWrapper")
            .attr("transform",`translate(${this.x},${this.y - this.radius})`);
        this.barRotate = this.barWrapper.append('g')
            .attr("class","barRotate")
            .style("transform-origin", `0px ${this.radius}px`)
            .attr("transform",`rotate(${this.degreeTheta})`);
        this.barHeight = this.barRotate.append('g')
                        .attr("class","barHeight")
                        .attr("transform",`translate(0, ${-this.height})`)
        this.bar = this.barHeight
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill","#2196F3")
            .attr("class", "bar b"+this.index)
            .attr("transform", `translate(-15,0)`);
        this.text = this.barHeight.append("text")
                    .attr("transform","translate(0,-10)")
                    .style("text-anchor","middle")
                    .html(`${this.value.toFixed(2)}`)
    }

    resetValue(newValue) {
        this.value = newValue;
        this.height = this.maxHeight*this.value;
        this.barHeight.transition().duration(100)
                .attr("transform",`translate(0,${-this.height})`)
        this.bar.transition().duration(100).attr("height",this.height);
        this.text.html(`${this.value.toFixed(2)}`)

        if(this.value > 0.5) {
            this.bar.style("fill","green")
        }else {
            this.bar.style("fill","#2196F3")
        }
    }
}

class Agent {
    constructor(config) {
        this.totalParts = config.parts;
        this.position = config.position;
        this.radius = config.radius;
        this.ele = config.ele;
        this.centerX = config.centerX;
        this.centerY = config.centerY;
    }

    move() {
        this.theta = this.position * (2*Math.PI / this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = (this.theta*180 / Math.PI)%360;
        this.robotRotate.transition().duration(200)
                        .attr("transform","rotate("+(this.degreeTheta)+")")
    }

    changePosition(newPosition) {
        this.position = newPosition;
        this.move();
    }

    goRight() {
        this.position = (this.position+1+this.totalParts)%this.totalParts;
        this.move();
    }
    goLeft() {
        this.position = (this.position-1+this.totalParts)%this.totalParts;
        this.move();
    }
    draw() {
        this.theta = this.position * (2*Math.PI / this.totalParts);
        this.theta += (Math.PI / this.totalParts);
        this.degreeTheta = (this.theta*180 / Math.PI)%360;


        this.robotWrapper = this.ele.append("g")
                                    .attr("class","robot-wrapper")
                                    .attr("transform", "translate("+ (this.centerX)+ ","+ (this.centerY - this.radius)+")");
        this.robotRotate = this.robotWrapper.append("g")
                                .style("transform-origin",`0px ${this.radius}px`)
                                .attr("transform",` rotate(${this.degreeTheta})`);

        this.robotEle = this.robotRotate.append("g")
                .attr("class", "robot-group")
                .attr("transform","rotate(180) translate(-15.5 -16)");
        this.robotEle
                .append("path")
                .attr("d", "M24.66,23.699c0-2.363-1.916-4.279-4.278-4.279h-1.646v-0.852c1.532-0.692,2.76-1.944,3.418-3.497c1.354-0.194,2.396-1.356,2.396-2.766c0-1.457-1.115-2.653-2.538-2.784c-0.363-0.748-0.865-1.416-1.467-1.977l2.279-6.524c0.141-0.399-0.071-0.838-0.471-0.978c-0.4-0.14-0.839,0.072-0.979,0.472l-2.125,6.082c-0.96-0.538-2.064-0.849-3.242-0.854l0,0c-0.002,0-0.005,0-0.008,0c-0.003,0-0.005,0-0.008,0l0,0c-1.175,0.007-2.28,0.316-3.24,0.854l-2.124-6.082c-0.14-0.399-0.578-0.611-0.979-0.472c-0.4,0.14-0.611,0.578-0.471,0.978l2.279,6.524c-0.602,0.561-1.103,1.229-1.467,1.977C8.565,9.653,7.45,10.85,7.45,12.307c0,1.408,1.042,2.57,2.396,2.767c0.659,1.552,1.885,2.804,3.418,3.496v0.852h-1.645c-2.363-0.001-4.278,1.915-4.278,4.278c0,2.338,1.876,4.237,4.206,4.276v4.025h3.292v-4.023h1.154h0.016h1.154v4.023h3.291v-4.024C22.783,27.937,24.66,26.038,24.66,23.699z M20.973,21.271l0.993,0.994c-0.111,0.071-0.245,0.114-0.387,0.114c-0.398,0-0.721-0.322-0.721-0.72C20.859,21.516,20.902,21.383,20.973,21.271z M20.973,23.182l0.993,0.994c-0.111,0.072-0.245,0.115-0.387,0.115c-0.398,0-0.721-0.323-0.721-0.722C20.859,23.427,20.902,23.294,20.973,23.182z M11.126,12.454c0-2.691,2.179-4.881,4.866-4.9l0,0c0.003,0,0.005,0,0.008,0c0.002,0,0.005,0,0.008,0l0,0c2.687,0.02,4.867,2.209,4.867,4.9c0,2.689-2.181,4.881-4.867,4.899l0,0c-0.002,0-0.005,0-0.008,0c-0.003,0-0.005,0-0.008,0l0,0C13.305,17.335,11.126,15.144,11.126,12.454z M21.58,26.309c-0.398,0-0.721-0.323-0.721-0.72c0-0.145,0.043-0.276,0.114-0.388l0.993,0.992C21.855,26.266,21.722,26.309,21.58,26.309z M22.185,25.977l-0.992-0.995c0.111-0.07,0.244-0.113,0.387-0.113c0.398,0,0.722,0.321,0.722,0.721C22.3,25.73,22.257,25.863,22.185,25.977z M22.185,23.957l-0.992-0.993c0.111-0.071,0.244-0.114,0.387-0.114c0.398,0,0.722,0.322,0.722,0.72C22.3,23.712,22.257,23.845,22.185,23.957z M22.185,22.046l-0.992-0.994c0.111-0.072,0.244-0.114,0.387-0.114c0.398,0,0.722,0.322,0.722,0.722C22.3,21.802,22.257,21.934,22.185,22.046z")
        this.robotEle
                .append("path")
                .attr("d","M20.107,12.454c0-2.271-1.84-4.117-4.106-4.131c-2.267,0.014-4.106,1.86-4.106,4.131c0,2.27,1.839,4.116,4.106,4.131C18.267,16.569,20.107,14.724,20.107,12.454z M13.046,12.454c0-1.636,1.316-2.96,2.947-2.979V9.474c0.003,0,0.005,0,0.008,0c0.002,0,0.005,0,0.008,0v0.001c1.63,0.019,2.945,1.344,2.945,2.979c0,1.634-1.315,2.96-2.945,2.979l0,0c-0.002,0-0.005,0-0.008,0s-0.005,0-0.008,0l0,0C14.362,15.414,13.046,14.088,13.046,12.454z")
    }
}

function observeAtDoor(obstacle) {
    let r = Math.random();
    if(obstacle.type == "door") {
        if(r <= obsProbMatrix["door"]["obs_door"]) {
            return true;
        }else{
            return false;
        }
    }else{
        if(r <= obsProbMatrix["wall"]["obs_wall"]) {
            return false;
        }else{
            return true;
        }
    }
}

function stochasticallyGo(direction,position, totalParts) {
    let r = Math.random();
    if(direction == "right") {
        if(r <= moveProbMatrix["right"]["1"]) {
            return (position + 1 + totalParts)%totalParts;
        }
        if(r <= moveProbMatrix["right"]["1"] + moveProbMatrix["right"]["0"]) {
            return position;
        }
        if(r <= moveProbMatrix["right"]["1"] + moveProbMatrix["right"]["0"] + moveProbMatrix["right"]["2"]) {
            return (position + 2 + totalParts)%totalParts;
        }
        return Math.floor(Math.random()*totalParts);
    }
    if(direction == "left") {
        if(r <= moveProbMatrix["left"]["-1"]) {
            return (position -1 + totalParts)%totalParts;
        }
        if(r <= moveProbMatrix["left"]["-1"] + moveProbMatrix["left"]["0"]) {
            return position;
        }
        if(r <= moveProbMatrix["left"]["-1"] + moveProbMatrix["left"]["0"] + moveProbMatrix["left"]["-2"]) {
            return (position - 2 + totalParts)%totalParts;
        }
        return Math.floor(Math.random()*totalParts);
    }
}

function calculateProbabilities(bars,obstacles,agent,move) {
    let probabilities = _.pluck(bars,"value");
    let totalParts = probabilities.length;
    let newProbabilities = _.map(_.range(totalParts), function(){return 0});
    _.each(probabilities,function(probability,index) {
        if(move === "right") {
            newProbabilities[(index+1+totalParts)%totalParts] += probability*moveProbMatrix["right"]["1"];
            newProbabilities[index] += probability*moveProbMatrix["right"]["0"];
            newProbabilities[(index+2+totalParts)%totalParts] += probability*moveProbMatrix["right"]["2"];
            newProbabilities = _.map(newProbabilities,function(np) {
                return np + probability*moveProbMatrix["right"]["random"]/totalParts;
            });
        }else if(move === "left") {
            newProbabilities[(index-1+totalParts)%totalParts] += probability*moveProbMatrix["left"]["-1"];
            newProbabilities[index] += probability*moveProbMatrix["left"]["0"];
            newProbabilities[(index-2+totalParts)%totalParts] += probability*probability*moveProbMatrix["left"]["-2"];
            newProbabilities = _.map(newProbabilities,function(np) {
                return np + probability*probability*moveProbMatrix["left"]["random"]/totalParts;
            });
        }else{
            newProbabilities[index] = probabilities[index];
        }
    });
    
    let agentObservation = observeAtDoor(obstacles[agent.position]);
    agentObservation = (agentObservation)?"door":"wall";

    agent.robotEle.style("fill",(agentObservation == "wall")?"gray":"#DEB887");

    newProbabilities =  _.map(newProbabilities, function(np, index) {
        let type = obstacles[index].type;
        if(type == "door") {
            if(agentObservation == "door") {
                return np*obsProbMatrix["door"]["obs_door"]
            }else{
                return np*obsProbMatrix["door"]["obs_wall"];
            }
        }else{
            if(agentObservation == "wall") {
                return np*obsProbMatrix["wall"]["obs_wall"];
            }else{
                return np*obsProbMatrix["wall"]["obs_door"];
            }
        }
    });
    let sum = _.reduce(newProbabilities,function(memo,num) {return memo+num},0);
    newProbabilities = _.map(newProbabilities,function(np){return np/sum});
    _.each(bars,function(bar,index) {
        bar.resetValue(newProbabilities[index])
    });
}

function app(obstacles, bars, agent) {
    let newPosition;
    calculateProbabilities(bars,obstacles, agent,"");
    $(document).keydown(function(e) {
        switch(e.which) {
            case 37: newPosition = stochasticallyGo("left",agent.position,agent.totalParts); 
                     agent.changePosition(newPosition);
                     calculateProbabilities(bars,obstacles, agent,"left");
                     break;
            case 39: newPosition = stochasticallyGo("right",agent.position,agent.totalParts); 
                     agent.changePosition(newPosition);
                     calculateProbabilities(bars,obstacles, agent,"right");
                     break;
        }
    });
}

$(document).ready(function() {
    vpHeight = window.innerHeight;
    vpWidth = window.innerWidth;    
    let wrapper = d3.select("#main-wrapper");
    let svg = wrapper.append("svg")
                    .attr("height", vpHeight)
                    .attr("width", vpWidth);
    let obstaclesEle = svg.append('g')
                    .classed("obstacles",true);
    let barEle = svg.append('g')
                    .classed("bars",true);
    let radius = 200;
    let parts = 50;

    let obstacles = [], bars = [];

    _.each(_.range(parts), function(index) {
        let obstacle = new Obstacle({
            centerX : vpWidth/2,
            centerY : vpHeight/2,
            radius : radius,
            index : index,
            parts : parts,
            type : (Math.random() > 0.5)?"door" : "wall",
            ele : obstaclesEle
        });
        obstacle.draw();
        obstacles.push(obstacle);

        let bar = new Bar({
            centerX : vpWidth/2,
            centerY : vpHeight/2,
            radius : radius+25,
            index : index,
            parts : parts,
            ele : barEle,
            value : 1/parts
        });
        bar.draw();
        bars.push(bar);
    });

    let agent = new Agent({
        ele : svg,
        parts : parts,
        position : 0,
        centerX : vpWidth/2,
        centerY : vpHeight/2,
        radius : radius - 30
    });
    agent.draw();
    app(obstacles,bars,agent)
});