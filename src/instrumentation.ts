import { Browser } from "puppeteer";

export const register = async()=>{
    if(process.env.NEXT_RUNTIME==='nodejs'){
        const {Worker} = await import("bullmq")
        const {connection, jobsQueue, prisma} = await (import("@/lib"))
        const puppeteer = await import ("puppeteer")
        const SBR_WS_ENDPOINT = "wss://brd-customer-hl_90b65c69-zone-our_trip_planner:88z9z03oujph@brd.superproxy.io:9222";

        new Worker("jobsQueue", async (job)=>{
            let browser:undefined|Browser = undefined;

            try {

                browser = await puppeteer.connect({
                    browserWSEndpoint: SBR_WS_ENDPOINT ,
                });

                const page = await browser.newPage();
                if(job.data.jobType.type==="location"){
                    console.log("Connected! Navigating to "+ job.data.url);
                    await page.goto(job.data.url);
                    console.log("Navigated! scraping page content....")
                }
                
            } catch (error) {
                console.log(error);
                await prisma.jobs.update({
                    where:{id:job.data.id},
                    data:{isComplete:true, status:"failed"}
                })
            }finally{
                await browser?.close()
                console.log("Browser closed successfully")
            }

        }, {
            connection, concurrency:10, removeOnComplete:{count:1000}, removeOnFail:{count:5000},
        })
    }
}