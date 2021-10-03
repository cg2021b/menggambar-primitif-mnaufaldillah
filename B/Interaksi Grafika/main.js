function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    //definisi titik-titik segitiga
    /**
     * A(0, 0.5); B(-0.5, -0.5), C(0.5, -0.5)
     */

    var vertices = [
        0, 0.5, 1.0, 0.0, 0.0,       //Titik A
        -0.5, -0.5, 0.0, 1.0, 0.0,  //Titik B
        0.5, -0.5, 0.0, 0.0, 1.0     //Titik C
    ];

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    //definisi vertex
    var vertexShaderCode = `
    attribute vec2 a_Position;
    attribute vec3 a_Color;
    varying vec3 v_Color;
    uniform float dx;
    uniform float dy;
    uniform float dz;
    void main(){
        v_Color = a_Color;
        mat4 translasi = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            dx, dy, dz, 1.0
        );
        gl_Position = translasi * vec4(a_Position, 0.0, 1.0);
    }`;

    //var vertexShaderCode = document.getElementById("vertexShaderCode").text;

     //membuat vertex shader
     var vertexShader = gl.createShader(gl.VERTEX_SHADER);
     gl.shaderSource(vertexShader, vertexShaderCode);
     gl.compileShader(vertexShader);

     //definisi fragment shader
    var fragmentShaderCode = document.getElementById("fragmentShaderCode").text;
    
    //membuat fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    //package program --> compile
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    //untuk menggambar titik dan warna berbeda
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    var aColor = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    gl.viewport(100, 0, canvas.width, canvas.height)

    var primitive = gl.TRIANGLES;
    var offset = 0;
    var count = 3;

    var dx = 0;
    var dy = 0;
    var dz = 0;
    var uDx = gl.getUniformLocation(shaderProgram, 'dx');
    var uDy = gl.getUniformLocation(shaderProgram, 'dy');
    var uDz = gl.getUniformLocation(shaderProgram, 'dz');

    //elemen interaktif
    var freeze = false;
    //on mouse click
    function onMouseClick(event){
        freeze = !freeze;
    }
    document.addEventListener('click', onMouseClick, false);
    //on key down
    function onKeyDown (event){
        if(event.keyCode == 32) freeze = true;
    }
    //on key up
    function onKeyUp (event){
        if(event.keyCode == 32) freeze = false;
    }
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    function render(){
        if(!freeze){
            dx += 0.001;
            dy += 0.001;
            dz += 0.001;
        }
        gl.uniform1f(uDx, dx);
        gl.uniform1f(uDy, dy);
        gl.uniform1f(uDz, dz);

        //set warna background
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        //clear background
        gl.clear(gl.COLOR_BUFFER_BIT);

        //instruksi untuk menggambar
        gl.drawArrays(primitive, offset, count);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}