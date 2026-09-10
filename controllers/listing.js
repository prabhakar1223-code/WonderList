const listing = require("../model/listing");
module.exports.index=async (req, res) => {

    const allList = await listing.find();

    console.log("all listings");

    res.render("listings/index.ejs", { allList });

}

module.exports.renderNewForm=(req, res) => {

    console.log("New Get route working");

    res.render("listings/new.ejs");

}

module.exports.createListing=async (req, res) => {

        
        const list = new listing(req.body.listing);

        list.owner = req.user._id;   // ⭐ important
          if(req.file){
     let url=req.file.path;
        let filename=req.file.filename;

        list.image={filename,url};
  }
        await list.save();

        req.flash("success", "New Listing Created Successfully!");
        res.redirect("/listings");
    }

  module.exports.renderEditForm=async (req, res) => {
  
          console.log("working edit route");
  
          let { id } = req.params;
  
          const list = await listing.findById(id);
           if(!list){
               req.flash("error"," Listing does not exist!");
               return res.redirect("/listings");
          }
          let originalurl=list.image.url;
          let image_url=originalurl.replace("/uploads","/upload/w_250");
        
          res.render("listings/edit.ejs", { list ,image_url});
  
      }

module.exports.renderShowpage=async (req, res) => {

        let { id } = req.params;

        const home = await listing.findById(id).populate("reviews").populate("owner");

        if(!home){
             req.flash("error"," Listing does not exist!");
             return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { home });

    }

module.exports.updateListing=async (req, res) => {

        let { id } = req.params;
       let list = await listing.findByIdAndUpdate(
            id,
            { ...req.body.listing }
        );

          if(req.file){
            let url=req.file.path;
            let filename=req.file.filename;
            list.image={filename,url};
             await list.save();
          }
         
        console.log(list);
         req.flash("success"," Listing Edited Succesfully!");
        res.redirect(`/listings/${id}`);

    }

module.exports.deleteListing=async (req, res) => {

        let { id } = req.params;

        let list = await listing.findByIdAndDelete(id);

        console.log(list);
 req.flash("success"," Listing Deleted Succesfully!");
        res.redirect("/listings");

    }