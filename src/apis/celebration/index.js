const router = require('express').Router();

const Service = require('./service');
const WebSocketService = require('./../../websocket/websocket-service');


router.get('/', async function (req, res) {
    res.render('celebration', {
        title: 'Scheduled-CountDown'
    });
});
router.post('/submit', async function (req, res) {
    try {
        var dateObject = {}
        var celebrationObject = {}
    
        var d = new Date()
        const offset = d.getTimezoneOffset()
        var yourDate = new Date(d.getTime() - (offset * 60 * 1000))
        var date = yourDate.toISOString().split('T')[0]
    
    
        var celebrationList = await Service.get()
    
        console.log("----------> celebration/submit");
        let tableNr = req.body.tableNr;
        let name = req.body.name;
        let reason = req.body.reason;
        let years = req.body.years;
        let info = req.body.info;
    
        celebrationObject = {
            tableNr: tableNr,
            name: name,
            reason: reason,
            years: years,
            info: info
        }


        if (!celebrationList) {
            console.log("there is no celebrationList")
            celebrationList = {}
            celebrationList[`${date}`] = []
            celebrationList[`${date}`].push(celebrationObject)
            write(celebrationList)
        } else {
            console.log("there is a celebrationList")
            if (!celebrationList[`${date}`]) {
                console.log("no CurrentDate")
                celebrationList[`${date}`] = []
                celebrationList[`${date}`].push(celebrationObject)
                write(celebrationList)
            } else {
                var duplicate = 0

                celebrationList[`${date}`].forEach(element => {
                    if (element.name === celebrationObject.name && element.years === celebrationObject.years) {
                        duplicate += 1
                     }
                    
                })
    
                console.log("Duplicates = "+duplicate)

                if (duplicate == 0) {
                    console.log("You SHould have got a new entry now")
                    celebrationList[`${date}`].push(celebrationObject)
                    await write(celebrationList)
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect('back');
});

async function write(data) {
    
    await Service.write(data)
}


module.exports = router;