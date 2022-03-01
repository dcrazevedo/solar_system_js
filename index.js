

class Planet{
    ASTRONOMICAL_UNIT = 149.6e6 * 1000;
    GRAVITATIONAL_UNIT = 6.67428e-11;
    SCALE = 250 / this.ASTRONOMICAL_UNIT
    TIMESTEP = 3600 * 24

    constructor(x, y, radius, color, mass){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.mass = mass;

        this.is_sun = false;
        this.distance_to_sun = 0;
        this.orbit = [];

        this.x_vel = 0;
        this.y_vel = 0;
    };

    drawPath(context){
        
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "white";

        context.moveTo(... this.orbit[0]);
        for (let point in this.orbit){
            context.lineTo(... this.orbit[point]);
        }
        context.stroke();
    }
    
    draw(canvas){
        
        const centerX = this.x * this.SCALE + canvas.width / 2;
        const centerY = this.y * this.SCALE + canvas.height / 2;
        const radius = this.radius;
        
        const context = canvas.getContext("2d");
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = 'black';
        context.stroke();
        
        if (this.orbit.length > 1){    
            this.drawPath(context)
        }
    };

    attraction(other){
        let other_x = other.x;
        let other_y = other.y

        let distance_x = other_x - this.x
        let distance_y = other_y - this.y

        let distance = Math.sqrt(distance_x ** 2 + distance_y ** 2)
        if (other.is_sun){
            this.distance_to_sun = distance
        }
        let force = this.GRAVITATIONAL_UNIT * this.mass * other.mass / distance ** 2
        let theta = Math.atan2(distance_y, distance_x)

        let force_x = Math.cos(theta) * force
        let force_y = Math.sin(theta) * force

        return [force_x, force_y]
    };

    updatePosition(planets){
        let total_fx = 0;
        let total_fy = 0;

        for (let planet in planets){
            if (this == planets[planet]){
                continue;
            }
            let forces = {...this.attraction(planets[planet])};
            total_fx += forces[0];
            total_fy += forces[1];
        }
        this.x_vel += total_fx / this.mass * this.TIMESTEP
        this.y_vel += total_fy / this.mass * this.TIMESTEP

        this.x += this.x_vel * this.TIMESTEP
        this.y += this.y_vel * this.TIMESTEP

        this.orbit.push([this.x, this.y])
    }
}


window.onload = function(){
    
    const tick = 1000/60;
    const canvas = document.getElementById("canvas");
    
    const sun     = new Planet(0, 0, 30, 'yellow', 1.98892e30);
    sun.is_sun = true;
    
    const earth   = new Planet(-1 * sun.ASTRONOMICAL_UNIT, 0, 16, 'blue', 5.9742e24);
    earth.y_vel = 29.783 * 1000
    earth.is_sun = false;

    const mars    = new Planet(-1.524 * sun.ASTRONOMICAL_UNIT, 0, 12, 'red', 6.39e23);
    mars.y_vel = 24.077 * 1000
    mars.is_sun = false
    
    const mercury = new Planet(0.387 * sun.ASTRONOMICAL_UNIT, 0, 8, 'gray', 3.30 * 10 ** 23);
    mercury.y_vel = -47.4 * 1000
    mercury.is_sun = false
    
    const venus   = new Planet(0.723 * sun.ASTRONOMICAL_UNIT, 0, 14, 'white', 4.8685 * 10 ** 23);
    venus.y_vel = -35.02 * 1000
    venus.is_sun = false
    
    const planets = [sun, earth, mars, mercury, venus]
    setInterval(updateSystem, tick, canvas, planets);
};

function updateSystem(canvas, planets){

    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (const planet in planets){
        
        planets[planet].updatePosition(planets)
        planets[planet].draw(canvas);
    }
    
}