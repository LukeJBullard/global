$(function(){
    //animate the turbine wheel
    var frames = ["|","\u2044","\u2013","\\"];
    var currentFrame = 0;

    setInterval(()=>{
        currentFrame++;
        if (currentFrame >= frames.length)
            currentFrame = 0;
        $("#wheel").text(frames[currentFrame]);
    }, 400);


    //when the run button is clicked
    var running = false;
    $("#run").click(function(){
        if (running)
            return;

        running = true;
        $("#body").addClass("running");

        var low = parseInt($("#low").val());
        var high = parseInt($("#high").val());
        var certainty = parseInt($("#certainty").val());
        var delay = parseInt($("#delay").val());

        $("#output").text("Turbine...");

        turbineWaitForReady().then(() => {
            response = turbineQuery(low,high,certainty,delay);
            response.then((responseValue) => {
                if (turbineQueryFailed(responseValue))
                {
                    //show error
                    $("#output").text("Failed");
                } else {
                    //show output
                    $("#output")
                        .text(responseValue)
                        .toggleClass("colorToggle");
                }
                $("body").removeClass("running");
                running = false;
            });
        });
    });
});