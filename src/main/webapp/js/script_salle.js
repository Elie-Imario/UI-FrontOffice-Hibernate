$(document).ready(function(){
    $(".tablelisteSalle").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
    })

    $('.btn-add').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_add_salle').on('click', function(){
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_salle').on('click', function () {
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })

    /*****************************
     * CRUD OPERATION
     */
    $('#confirm_add_salle').on('click', function () {
        let designation_input = $("input[name='DesignationToAdd']")
        let datas = dataTableToArray($(".tablelisteSalle").DataTable())
        
        if(isFormValid(designation_input) && isValueCorrect(designation_input, datas)) addSalle(designation_input)
        else console.log("error")
    })

    $('#confirm_edit_salle').on('click', function () {
        let newdesignation_input = $("input[name='DesignationToEdit']")
        let IndexSalleToExclude = $("input[name='IdSalle']").val()

        let datas = generateNewArrayFromExpectedId(IndexSalleToExclude, dataTableToArray($(".tablelisteSalle").DataTable()))
        
        console.log(datas)
        
        if(isFormValid(newdesignation_input) && isValueCorrect(newdesignation_input, datas)) updateSalle(newdesignation_input)
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
function addSalle(_designation_input){
    $.ajax({
        type: "POST",
        data:{
            designation: _designation_input.val(),
            RequestType: "AddSalle"
        },
        url: "Salle",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 201){
                    $.ajax({
                        type: "POST",
                        data:{
                            RequestType: "GetLastInsertSalle"
                        },
                        url: "Salle",
                        cache: false,
                        dataType: "json",
                        success: function (data){
                            $.each(data, (index, response) => {
                                let _options = '<div class="options">'+
                                    '<button type="button" class="option-btn-item" onclick="initUpdateSalle('+ response.id_Salle +')"><span><i class="fa fa-edit"></i></span></button>'+
                                    '<button type="button" class="option-btn-item" onclick="deleteSalle('+ response.id_Salle +')"><span><i class="fa fa-trash"></i></span></button>'+
                                    '</div>'
                                let data = [response.id_Salle,response.designation,_options]

                                $(".tablelisteSalle").dataTable().fnAddData(data)
                                $(".tablelisteSalle tbody tr:first").attr('id', 'row'+response.id_Salle)
                            })
                        }
                    })
                    closeModal(".container-input100.addModalPopUp");
                    getTotalSalle()
                    clearInputForm()
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function initUpdateSalle(idSalle){
    $.ajax({
        type: "POST",
        data:{
            Id_Salle: idSalle,
            RequestType : "getSalleById"
        },
        url: "Salle",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                $("#editModalPopUp-header").text("Modifier la Salle N°"+response.id_Salle)
                $("input[name='IdSalle']").val(response.id_Salle)
                $("input[name='DesignationToEdit']").val(response.designation)

                showModal(".container-input100.editModalPopUp")
            })
        }
    })
}

function updateSalle(_newDesignationinput){
    let IndexSalleToUpdate = $("input[name='IdSalle']").val()

    $.ajax({
        type: "POST",
        data:{
            Id_Salle: IndexSalleToUpdate,
            newDesignation: _newDesignationinput.val(),
            RequestType: "UpdateSalle"
        },
        url: "Salle",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 200) {
                    let row = $("#row"+IndexSalleToUpdate+"")
                    let options = '<div class="options">'+
                        '<button type="button" class="option-btn-item" onclick="initUpdateSalle('+IndexSalleToUpdate+')"><span><i class="fa fa-edit"></i></span></button>'+
                        '<button type="button" class="option-btn-item" onclick="deleteSalle('+IndexSalleToUpdate+')"><span><i class="fa fa-trash"></i></span></button>'+
                        '</div>'
                    let newData = [IndexSalleToUpdate,_newDesignationinput.val(),options]

                    $(".tablelisteSalle").DataTable().row(row).data(newData).draw(false)
                    closeModal(".container-input100.editModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function deleteSalle(IdSalle){
    if(confirm("Voulez-vous retirer la Salle "+IdSalle+" ?")){
        $.ajax({
            type: "POST",
            data: {
                Id_Salle: IdSalle,
                RequestType: "DeleteSalle"
            },
            url: "Salle",
            cache: false,
            dataType: "json",
            success:function (data) {
                $.each(data, (index, response)=>{
                    if(response.requestStatusCode == 204){
                        let row = $("#row"+IdSalle+"")
                        $(".tablelisteSalle").dataTable().fnDeleteRow(row)
                        getTotalSalle()
                        getTotalOcc()
                        showAlert(response.sucessMsg)
                    }
                })
            }
        })
    }
}

function getTotalSalle(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalSalle"
        },
        url: "Salle",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalSalle").text(data.TotalSalle)
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


function isValueCorrect(input1, datas){
    clearInputClassError()
    fadeAlertMsg()

    let errorWrapper = $(".alert-wrapper")
    let errorcontainer = $(".error")
    let errorMsg = $(".error-msg")

    if(ifexists(input1.val().toLowerCase(), datas)){
        animateForm(input1)
 
        displayErrorMsg(errorWrapper, errorcontainer, errorMsg, "Cette salle est déjà enregistrée")

        return false
    }else{
        return true
    }
}


function isFormValid(input1){
    clearInputClassError()
    fadeAlertMsg()

    let errorWrapper = $(".alert-wrapper")
    let errorcontainer = $(".error")
    let errorMsg = $(".error-msg")

    if(input1.val() == ""){
        animateForm(input1)
        displayErrorMsg(errorWrapper, errorcontainer, errorMsg, "Veuillez renseigner la designation de la salle!")
        return false
    }else{  
        return true
    }
}


function ifexists(designation, datas){
    for (const data of datas) {
        if(data.designation === designation){
            return true
        }
    }
    return false
}

function dataTableToArray(dataTable) {
    let rows = dataTable.rows().data().toArray()
    let dataArray = []

    for (let i = 0; i < rows.length; i++) {
      dataArray.push({id: rows[i][0], designation: rows[i][1].toLowerCase()})
    }
    return dataArray;
}


function generateNewArrayFromExpectedId(id, datas){
    let newArray = []
    $.each(datas, (index,data)=>{
        if(id != data.id){
            newArray.push({id: data.id, designation: data.designation})
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
        inputs.removeClass("incorrect")
        inputs.css('animation', "")
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

function clearInputForm(){
    let inputs = $("input")
    for(let i=0; i<inputs.length; i++){
        inputs[i].value = ""
    }
}




