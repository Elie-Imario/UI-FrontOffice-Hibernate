$(document).ready(function(){
    $(".tablelistereservation").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
    })

    getSalles_for_autoComplete()
    getProf_for_autoComplete()

    let dateDebut = new Date();
    $("#input100-date_occupation").datepicker({
        dateFormat: "dd/mm/yyyy",
        daysOfWeekDisabled: [0], //Disable Sunday
    })
    //set Start date from Now
    $('#input100-date_occupation').datepicker('setStartDate', dateDebut);

    $("#input100-date_occupation_").datepicker({
        dateFormat: "dd/mm/yyyy",
        daysOfWeekDisabled: [0], //Disable Sunday
    });
    //set Start date from Now
    $('#input100-date_occupation_').datepicker('setStartDate', dateDebut);

    $('#occupersalle').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_booking').on('click', function(){
        clearInputClassError()
        clearInputForm()
        fadeGlobalAlertMsg()
        fadeAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        clearInputClassError()
        clearInputForm()
        fadeGlobalAlertMsg()
        fadeAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        clearInputClassError()
        clearInputForm()
        fadeGlobalAlertMsg()
        fadeAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_booking').on('click', function () {
        clearInputClassError()
        fadeGlobalAlertMsg()
        fadeAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })

    $("input[name='date_occupationToAdd']").on("input", function (e) {
        let val = e.target.value.replace(/\D|\d/g, "")
        e.target.value=val
    })

    /****************************
     * CRUD OPERATION
     */
    $('#confirm_submit_booking').on('click', function () {
        let IdProf_input = $("input[name='idProf_qui_va_occuper']")
        let IdSalle_input = $("input[name='idSalle_a_occuper']")
        let prof_name = $("input[name='ProfFirstNameToAdd']")
        let designation_salle = $("input[name='SalleDesignationToAdd']")
        let dateOccupation_input = $("input[name='date_occupationToAdd']")
        let date_Occupation = new Date($('#input100-date_occupation').datepicker("getDate")).format("dd/mm/yyyy")

        let datas = dataTableToArray($(".tablelistereservation").DataTable())


        if(isFormValid(prof_name,designation_salle,dateOccupation_input)){
            if(ifProfinBd(prof_name) && ifSalleinBd(designation_salle)){
                if(isValueCorrect(prof_name, designation_salle, dateOccupation_input, datas)){
                    if(ifReservationPossible(prof_name,dateOccupation_input, datas) && ifSalleDisponible(designation_salle, dateOccupation_input, datas)){
                        reserverSalle(IdProf_input, IdSalle_input, date_Occupation)
                    }
                }
            }
        }
        else console.log("error")
    })

    $('#confirm_edit_booking').on('click', function (e) {
        let newIdSalle_input = $("input[name='idSalle_occupe']")
        let newdateOccupation_input = new Date($('#input100-date_occupation_').datepicker("getDate")).format("dd/mm/yyyy")

        let prof_name_edit = $("input[name='profname']")
        let designation_salle_edit = $("input[name='SalleDesignationToEdit']")
        let dateOccupation_input_edit = $("input[name='date_occupationToEdit']")

        let Code_R_toExclude = $("input[name='Code_R']").val()

        let datas = generateNewArrayFromExpectedId(Code_R_toExclude, dataTableToArray($(".tablelistereservation").DataTable()))

        console.log(datas)
        if(isFormValid(prof_name_edit,designation_salle_edit,dateOccupation_input_edit)){
            if(ifSalleinBd(designation_salle_edit)){
                if(isValueCorrect(prof_name_edit, designation_salle_edit, dateOccupation_input_edit, datas)){
                    if(ifReservationPossible(prof_name_edit,dateOccupation_input_edit, datas) && ifSalleDisponible(designation_salle_edit, dateOccupation_input_edit, datas)){
                        updateBooking(newIdSalle_input, newdateOccupation_input)
                    }
                }
            }
        }
        else console.log("error")
    })
})

/* Implement  functions*/

function closeModal(popuptoClose){
    $('.modal-limiter').removeClass('show')
    $(popuptoClose).addClass('hide')
}
function showModal(popuptoshow){
    $('.modal-limiter').addClass('show')
    $(popuptoshow).removeClass('hide')
}


function callGetAllprofAjaxRequest() {
    return $.ajax({
        type: "POST",
        data: {
            RequestType: "getAllProfs"
        },
        async: false,
        url: "Professeur",
        cache: false,
        dataType: 'json',
    })
}

function callGetAllSalleAjaxRequest() {
    return $.ajax({
        type: "POST",
        data: {
            RequestType: "getAllSalles"
        },
        async: false,
        url: "Salle",
        cache: false,
        dataType: 'json',
    })
}


function getProf_for_autoComplete(){
    let names = []
    callGetAllprofAjaxRequest().done((data) => {
        $.each(data, (index, response)=>{
            names.push({id_Prof : response.id_prof, name: response.nom +" "+ response.prenom})
            initializeProfAutoComplete(names)
        })
    })
}

function getSalles_for_autoComplete(){
    let salles = []
    callGetAllSalleAjaxRequest().done((data) => {
        $.each(data, (index, response)=>{
            salles.push({id_Salle: response.id_Salle, designation_salle:response.designation})
            initializeSalleAutoComplete(salles)
        })
    })
}

function initializeProfAutoComplete(profs){
    $("#input100-NomProf_qui_va_occuper").autocomplete({
        lookup: profs.map((prof)=>{
            return prof.name
        }),
        onSelect: function (suggestion) {
            const selectedProf = profs.find((prof) => prof.name === suggestion.value);
            const selectedProfId = selectedProf ? selectedProf.id_Prof : null;

            $("input[name='idProf_qui_va_occuper']").val(selectedProfId)
        }
    })
}

function initializeSalleAutoComplete(salles){
    $("#input100-salle_a_occuper").autocomplete({
        lookup: salles.map((salle)=>{
            return salle.designation_salle
        }),
        onSelect: function (suggestion) {
            const selectedSalle = salles.find((salle) => salle.designation_salle === suggestion.value);
            const selectedSalleId = selectedSalle ? selectedSalle.id_Salle : null;

            $("input[name='idSalle_a_occuper']").val(selectedSalleId)
        }
    })

    $("#input100-salle_a_occuper_").autocomplete({
        lookup: salles.map((salle)=>{
            return salle.designation_salle
        }),
        onSelect: function (suggestion) {
            const selectedSalle = salles.find((salle) => salle.designation_salle === suggestion.value);
            const selectedSalleId = selectedSalle ? selectedSalle.id_Salle : null;

            $("input[name='idSalle_occupe']").val(selectedSalleId)
        }
    })
}

function reserverSalle(_IdprofInput,_IdSalleInput,_dateOccupation_input) {
    $.ajax({
        type: "POST",
        data:{
            IdProf: _IdprofInput.val(),
            IdSalle: _IdSalleInput.val(),
            date_Occ : _dateOccupation_input,
            RequestType: "OccuperSalle"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 201){
                    $.ajax({
                        type: "POST",
                        data:{
                            RequestType: "GetLastInsertBooking"
                        },
                        url: "Occuper",
                        cache: false,
                        dataType: "json",
                        success: function (data){
                            $.each(data, (index, response) => {
                                let _options = '<div class="options">'+
                                    '<button type="button" class="option-btn-item" onclick="initUpdateBooking('+ response[0] +')"><span><i class="fa fa-edit"></i></span></button>'+
                                    '<button type="button" class="option-btn-item" onclick="deleteBooking('+ response[0] +')"><span><i class="fa fa-trash"></i></span></button>'+
                                    '</div>'

                                let data = [response[0], response[1], response[2], response[3], new Date(response[4]).format("dd/mm/yyyy"), _options]

                                $(".tablelistereservation").dataTable().fnAddData(data)
                                $(".tablelistereservation tbody tr:first").attr('id', 'row'+response[0])
                            })
                        }
                    })
                    getTotalOcc()
                    clearInputForm()
                    closeModal(".container-input100.addModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function initUpdateBooking(idReservation){
    $.ajax({
        type: "POST",
        data:{
            Id_R: idReservation,
            RequestType : "getOccById"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                $("#editModalPopUp-header").text("Modifier la reservation N°"+response[0])
                $("input[name='Code_R']").val(response[0])
                $("input[name='idProf_qui_occupe']").val(response[1])
                $("input[name='idSalle_occupe']").val(response[4])
                $("input[name='nom_prof']").val(response[2])
                $("input[name='Prenom_prof']").val(response[3])

                $("input[name='profname']").val(response[2]+" "+response[3])
                $("input[name='SalleDesignationToEdit']").val(response[5])
                $("input[name='date_occupationToEdit']").datepicker('setDate', new Date(response[6]))

                showModal(".container-input100.editModalPopUp")
            })
        }
    })
}

function deleteBooking(idReservation){
    if(confirm("Voulez-vous retirer la reservation de cette salle ?")){
        $.ajax({
            type: "POST",
            data: {
                Id_R: idReservation,
                RequestType: "DeleteOcc"
            },
            url: "Occuper",
            cache: false,
            dataType: "json",
            success:function (data) {
                $.each(data, (index, response)=>{
                    if(response.requestStatusCode == 204){
                        let row = $("#row"+idReservation+"")
                        $(".tablelistereservation").dataTable().fnDeleteRow(row)
                        getTotalOcc()
                        showAlert(response.sucessMsg)
                    }
                })
            }
        })
    }

}

function updateBooking(_newId_Salle, _newDateOcc){
    let IndexOccToUpdate = $("input[name='Code_R']").val()
    let profFirstname = $("input[name='nom_prof']").val()
    let profLastName = $("input[name='Prenom_prof']").val()
    let salleDesignation = $("input[name='SalleDesignationToEdit']").val()

    $.ajax({
        type: "POST",
        data:{
            Id_R: IndexOccToUpdate,
            newId_Salle: _newId_Salle.val(),
            newDateOcc: _newDateOcc,
            RequestType: "UpdateOcc"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 200) {
                    let row = $("#row"+IndexOccToUpdate+"")
                    let options = '<div class="options">'+
                        '<button type="button" class="option-btn-item" onclick="initUpdateBooking('+IndexOccToUpdate+')"><span><i class="fa fa-edit"></i></span></button>'+
                        '<button type="button" class="option-btn-item" onclick="deleteBooking('+IndexOccToUpdate+')"><span><i class="fa fa-trash"></i></span></button>'+
                        '</div>'
                    let newData = [IndexOccToUpdate,profFirstname,profLastName,salleDesignation,_newDateOcc,options]

                    $(".tablelistereservation").DataTable().row(row).data(newData).draw(false)
                    closeModal(".container-input100.editModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function getTotalOcc(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalOcc"
        },
        url: "Occuper",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalOcc").text(data.TotalOcc)
        }
    })
}
function showAlert(alertMsg){
    if ($(".alert-success").hasClass("disappered")) {
        $(".alert-success").removeClass("disappered");
        $(".alert-success").addClass("displayed");

    }

    $(".alertmsg").text(alertMsg)
    $(".alert-success").addClass("displayed")

    setTimeout(() => {
        $(".alert-success").removeClass("displayed")
        $(".alert-success").addClass("disappered")
    }, 5000)

    clearInterval()
}

function closeAlert(){
    $(".alert-success").removeClass("displayed")
    $(".alert-success").addClass("disappered")
}

function clearInputForm(){
    let inputs = $("input")
    for(let i=0; i<inputs.length; i++){
        inputs[i].value = ""
    }
}

/* Verify data */
function isValueCorrect(input1, input2, input3, datas){
    clearInputClassError()
    fadeGlobalAlertMsg()
    fadeAlertMsg()

    let errorGlobalWrapper = $(".alert-wrapper.global-error")
    let errorGlobalcontainer = $(".globalerror-container")
    let GlobalerrorMsg = $(".globalerror-msg")

    if(ifexists(input1.val().toLowerCase(), input2.val().toLowerCase(), input3.val(), datas)){
        animateForm(input1)
        animateForm(input2)
        animateForm(input3.parent())
 
        displayErrorMsg(errorGlobalWrapper, errorGlobalcontainer, GlobalerrorMsg, "Une même reservation a été déjà faite!")
        return false
    }else{
        return true
    }
}


function ifSalleDisponible(input1, input2, datas){
    clearInputClassError()
    fadeGlobalAlertMsg()
    fadeAlertMsg()

    let errorGlobalWrapper = $(".alert-wrapper.global-error")
    let errorGlobalcontainer = $(".globalerror-container")
    let GlobalerrorMsg = $(".globalerror-msg")

    if(isSalleDispo(input1.val().toLowerCase(), input2.val(), datas)){
        animateForm(input1)
        animateForm(input2.parent())
 
        displayErrorMsg(errorGlobalWrapper, errorGlobalcontainer, GlobalerrorMsg, "Cette Salle est occupée pour la date seléctionnée!")

        return false
    }else{
        return true
    }   
}

function ifReservationPossible(input1, input2, datas){
    clearInputClassError()
    fadeGlobalAlertMsg()
    fadeAlertMsg()

    let errorGlobalWrapper = $(".alert-wrapper.global-error")
    let errorGlobalcontainer = $(".globalerror-container")
    let GlobalerrorMsg = $(".globalerror-msg")

    if(isPossible(input1.val().toLowerCase(), input2.val(), datas)){
        animateForm(input1)
        animateForm(input2.parent())
 
        displayErrorMsg(errorGlobalWrapper, errorGlobalcontainer, GlobalerrorMsg, "Ce professeur ne peut plus occuper une autre salle pour cette date!")

        return false
    }else{
        return true
    }   
}

function isFormValid(input1, input2, input3){
    clearInputClassError()
    fadeGlobalAlertMsg()
    fadeAlertMsg()

    let errorGlobalWrapper = $(".alert-wrapper.global-error")
    let errorGlobalcontainer = $(".globalerror-container")
    let GlobalerrorMsg = $(".globalerror-msg")


    if(input1.val() == "" && input2.val() == "" && input3.val() == ""){
        animateForm(input1)
        animateForm(input2)
        animateForm(input3.parent())
        displayErrorMsg(errorGlobalWrapper, errorGlobalcontainer, GlobalerrorMsg, "Veuillez remplir ces champs!")
        return false
    }
    else if(input1.val() == ""){
        animateForm(input1)
        displayErrorMsg(input1.siblings("div"), input1.siblings("div").children(), input1.siblings("div").children().children("span"), "Veuillez renseigner le nom du professeur!")
        return false
    }
    else if(input2.val() == ""){
        animateForm(input2)
        displayErrorMsg(input2.siblings("div"), input2.siblings("div").children(), input2.siblings().children().children("span"), "Veuillez renseigner la designation de la salle!")
        return false
    }
    else if(input3.val() == ""){
        animateForm(input3.parent())
        displayErrorMsg(input3.parent().siblings("div"), input3.parent().siblings("div").children(), input3.parent().siblings().children().children("span"), "Veuillez renseigner la date à laquelle la salle sera occupée!")
        return false
    }
    else{
        return true
    }
}

function ifProfinBd(input1){
    let names = []
    let position
        callGetAllprofAjaxRequest().done((datas) => {
            $.each(datas, (index, data) => {
                names.push(data.nom +" "+ data.prenom)
            })
            position = names.indexOf(input1.val())
        })

    if(position == -1){
        animateForm(input1)
        displayErrorMsg(input1.siblings("div"), input1.siblings("div").children(), input1.siblings().children().children("span"), "Ce Professeur n'est pas encore enregistrée!")
        return false
    }else {
        return true
    }


}

function ifSalleinBd(input2){
    let salles = []
    let position
    callGetAllSalleAjaxRequest().done((datas) => {
        $.each(datas, (index, data) => {
            salles.push(data.designation)
        })
        position = salles.indexOf(input2.val())
    })
    if(position == -1){
        console.log("erreur salle")
        animateForm(input2)
        displayErrorMsg(input2.siblings("div"), input2.siblings("div").children(), input2.siblings().children().children("span"), "Cette Salle n'est pas encore enregistrée!")
        return false
    }else {
        return true
    }
}

function ifexists(nom, designation, date_occ, datas){
    for (const data of datas) {
        if(data.nom === nom && data.designation_salle === designation && data.datereservation === date_occ ){
            return true
        }
    }
    return false
}

function isPossible(nom, date_occ, datas){
    for (const data of datas) {
        if(data.nom === nom && data.datereservation === date_occ ){
            return true
        }
    }
    return false   
}

function isSalleDispo(designation, date_occ, datas){
    for (const data of datas) {
        if(data.designation_salle === designation && data.datereservation === date_occ ){
            return true
        }
    }
    return false   
}

function dataTableToArray(dataTable) {
    let rows = dataTable.rows().data().toArray()
    let dataArray = []

    for (let i = 0; i < rows.length; i++) {
      dataArray.push({id: rows[i][0], nom: rows[i][1].toLowerCase()+" "+rows[i][2].toLowerCase(),designation_salle:rows[i][3].toLowerCase(), datereservation:rows[i][4]})
    }
    return dataArray;
}

function generateNewArrayFromExpectedId(id, datas){
    let newArray = []
    $.each(datas, (index,data)=>{
        if(id != data.id) {
            newArray.push({
                id: data.id,
                nom: data.nom,
                designation_salle: data.designation_salle,
                datereservation: data.datereservation
            })
        }
    })
    return newArray
}


function animateForm(input){
    input.addClass("incorrect")
    input.css('animation', "bounce-in 1.15s ease")
    input.on('animationend', function(){
        input.css('animation', "")
    })
}

function clearInputClassError(){
    const inputs = $("input")
    if(inputs.hasClass("incorrect")){
        inputs.parent().removeClass("incorrect")
        inputs.parent().css('animation', "")

        inputs.removeClass("incorrect")
        inputs.css('animation', "")
    }else if(inputs.parent("div").hasClass("incorrect")){
        inputs.parent("div").removeClass("incorrect")
    }
}

function displayErrorMsg(container, errorcontainer, errorMsg, msg){
    container.addClass("not_collapse")
    errorcontainer.addClass('show')
    errorMsg.text(msg)
    $(".not_collapse").parent().addClass("m-b-0")
}

function fadeAlertMsg(){
    if($(".alert-wrapper").hasClass("not_collapse") && $(".error").hasClass("show")){
        $(".not_collapse").parent().removeClass("m-b-0")
        $(".alert-wrapper").removeClass("not_collapse")
        $(".error").removeClass("show")
    }
}

function fadeGlobalAlertMsg(){
    if($(".alert-wrapper.global-error").hasClass("not_collapse") && $(".globalerror-container").hasClass("show")){
        $(".not_collapse").parent().removeClass("m-b-0")
        $(".alert-wrapper.global-error").removeClass("not_collapse")
        $(".globalerror-container").removeClass("show")
    }
}



