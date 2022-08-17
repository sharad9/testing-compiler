const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");



const addJobToQueue = async (id) => {
  
    const jobId = id;
    const job = await Job.findById(jobId);
    if (job === undefined) {
      throw Error(`cannot find Job with id ${jobId}`);
    }
    try {
      let output;
      job["startedAt"] = new Date();
      if (job.language === "cpp") {
        output = await executeCpp(job.filepath);
      } else if (job.language === "py") {
        output = await executePy(job.filepath);
      }
     
      job["completedAt"] = new Date();
      job["output"] = output;
      job["status"] = "success";
      await job.save();
      return true;
    } catch (err) {
      job["completedAt"] = new Date();
      job["output"] = JSON.stringify(err);
      job["status"] = "error";
      await job.save();
      //throw Error(JSON.stringify(err));
    }
  
};

module.exports = {
  addJobToQueue,
};
