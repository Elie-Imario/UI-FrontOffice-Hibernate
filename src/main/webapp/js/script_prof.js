$(document).ready(function(){
    $(".tablelisteProf").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
    })


    $('#addProf').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_add_prof').on('click', function(){
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        fadeGlobalAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        fadeGlobalAlertMsg()
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        clearInputClassError()
        fadeAlertMsg()
        fadeGlobalAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_prof').on('click', function () {
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        fadeGlobalAlertMsg()
        closeModal(".container-input100.editModalPopUp")
    })


    $(".close-btn").click(function () {
        clearInputForm()
        clearInputClassError()
        fadeAlertMsg()
        fadeGlobalAlertMsg()
        closeAlert()
    })


    /*****************************
     * CRUD OPERATION
     */
    $('#confirm_submit_prof').on('click', function () {
        let firstname_input = $("input[name='firstnameProfToAdd']")
        let lastname_input = $("input[name='lastnameProfToAdd']")
        let grade_select = $("select[name='gradeProfToAdd']")
        let datas = dataTableToArray($(".tablelisteProf").DataTable())

        if(isFormValid(firstname_input) && isValueCorrect(firstname_input,lastname_input,datas)) addProf(firstname_input, lastname_input, grade_select)
        else console.log("error")
    })

    $('#confirm_edit_prof').on('click', function () {
        let newfirstname_input = $("input[name='firstnameProfToEdit']")
        let newlastname_input = $("input[name='lastnameProfToEdit']")
        let newgrade_select = $("select[name='gradeProfToEdit']")

        let IndexProfToExclude = $("input[name='IdProf']").val()

        let datas = generateNewArrayFromExpectedId("PR-"+IndexProfToExclude, dataTableToArray($(".tablelisteProf").DataTable()))
        console.log(datas)

        if(isFormValid(newfirstname_input) && isValueCorrect(newfirstname_input,newlastname_input,datas)) updateLecteur(newfirstname_input, newlastname_input, newgrade_select)
        else console.log("error")

    })

    //RECHERCHE
    $("#searchProf_btn").click(function(){
        let searchParams = []
        searchParams.push($("input[name='id_prof_for_search']").val(), $("input[name='name_prof_for_search']").val())
        $(".tablelisteProf").DataTable().column(0).search(searchParams[0]).column(1).search(searchParams[1]).draw()
    })
    $("#reinitialiserProfSearch").click(function () {
        $(".tablelisteProf").DataTable().column(0).search("").column(1).search("").draw()
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
function showDropDownMenu(){
    $('.dropdown-additonal-menu').addClass('show')   
}

function addProf(_firstname_input, _lastname_input, _grade_select){
    $.ajax({
        type: "POST",
        data:{
            firstname: _firstname_input.val(),
            lastname: _lastname_input.val(),
            grade : _grade_select.val(),
            RequestType: "AddProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 201){
                    $.ajax({
                        type: "POST",
                        data:{
                            RequestType: "GetLastInsertProf"
                        },
                        url: "Professeur",
                        cache: false,
                        dataType: "json",
                        success: function (data){
                            $.each(data, (index, response) => {
                                let _options = '<div class="options">'+
                                    '<button type="button" class="option-btn-item" onclick="initUpdateProf('+ response.id_prof +')"><span><i class="fa fa-edit"></i></span></button>'+
                                    '<button type="button" class="option-btn-item" onclick="deleteProf('+ response.id_prof +')"><span><i class="fa fa-trash"></i></span></button>'+
                                    '</div>'
                                let data = ["PR-"+response.id_prof, response.nom, response.prenom, response.grade, _options]

                                $(".tablelisteProf").dataTable().fnAddData(data)
                                $(".tablelisteProf tbody tr:first").attr('id', 'row'+response.id_prof)
                            })
                        }
                    })
                    closeModal(".container-input100.addModalPopUp");
                    getTotalProf()
                    clearInputForm()
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function initUpdateProf(idProf){
    $.ajax({
        type: "POST",
        data:{
            Id_Prof: idProf,
            RequestType : "getProfById"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                $("#editModalPopUp-header").text("Modifier Prof N°"+response.id_prof)
                $("input[name='IdProf']").val(response.id_prof)
                $("input[name='firstnameProfToEdit']").val(response.nom)
                $("input[name='lastnameProfToEdit']").val(response.prenom)
                $("select[name='gradeProfToEdit']").val("")
                $("option[value="+"'"+response.grade+"'"+"]").attr("selected", "selected")
                $("select[name='gradeProfToEdit']").val($("option[selected='selected']").val())

                showModal(".container-input100.editModalPopUp")
            })
        }
    })
}

function updateLecteur(_newFirstnameinput, _newlastnameinput, _newgradeselect){
    let IndexProfToUpdate = $("input[name='IdProf']").val()

    $.ajax({
        type: "POST",
        data:{
            Id_Prof: IndexProfToUpdate,
            newfirstname: _newFirstnameinput.val(),
            newlastname: _newlastnameinput.val(),
            newgrade : _newgradeselect.val(),
            RequestType: "UpdateProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $.each(data, (index, response)=>{
                if(response.requestStatusCode == 200) {
                    let row = $("#row"+IndexProfToUpdate+"")
                    let options = '<div class="options">'+
                        '<button type="button" class="option-btn-item" onclick="initUpdateProf('+IndexProfToUpdate+')"><span><i class="fa fa-edit"></i></span></button>'+
                        '<button type="button" class="option-btn-item" onclick="deleteProf('+IndexProfToUpdate+')"><span><i class="fa fa-trash"></i></span></button>'+
                        '</div>'
                    let newData = ["PR-"+IndexProfToUpdate,_newFirstnameinput.val(),_newlastnameinput.val(),_newgradeselect.val(),options]

                    $(".tablelisteProf").DataTable().row(row).data(newData).draw(false)
                    closeModal(".container-input100.editModalPopUp")
                    showAlert(response.sucessMsg)
                }
            })
        }
    })
}

function deleteProf(IdProf){
    if(confirm("Voulez-vous supprimer le professeur "+IdProf+" ?")){
        $.ajax({
            type: "POST",
            data: {
                Id_Prof: IdProf,
                RequestType: "DeleteProf"
            },
            url: "Professeur",
            cache: false,
            dataType: "json",
            success:function (data) {
                $.each(data, (index, response)=>{
                    if(response.requestStatusCode == 204){
                        let row = $("#row"+IdProf+"")
                        $(".tablelisteProf").dataTable().fnDeleteRow(row)
                        getTotalProf()
                        getTotalOcc()
                        showAlert(response.sucessMsg)
                    }
                })
            }
        })
    }
}
function getTotalProf(){
    $.ajax({
        type: "POST",
        data:{
            RequestType : "getTotalProf"
        },
        url: "Professeur",
        cache: false,
        dataType: "json",
        success: function (data) {
            $("#totalProf").text(data.TotalProf)
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


/* input error */
function isValueCorrect(input1, input2, datas){
    clearInputClassError()

    let errorWrapper = $(".alert-wrapper.global-error")
    let errorcontainer = $(".globalerror-container")
    let errorMsg = $(".globalerror-msg")

    if(ifexists(input1.val().toLowerCase(), input2.val().toLowerCase(), datas)){
        animateForm(input1)
        animateForm(input2)

        displayErrorMsg(errorWrapper, errorcontainer, errorMsg, "un professeur ayant les mêmes informations existe deja")

        return false
    }else{
        return true
    }
}


function isFormValid(input1){
    clearInputClassError()
    fadeAlertMsg()
    fadeGlobalAlertMsg()

    let errorWrapper = $(".alert-wrapper")
    let errorcontainer = $(".error")
    let errorMsg = $(".error-msg")

    if(input1.val() == ""){
        animateForm(input1)
        displayErrorMsg(errorWrapper, errorcontainer, errorMsg, "Veuillez renseigner le nom du professeur!")
        return false
    }else{  
        return true
    }
}


function ifexists(firstname, lastname, datas){
    for (const data of datas) {
        if(data.firstname === firstname && data.lastname === lastname){
            return true
        }
    }
    return false
}

function dataTableToArray(dataTable) {
    let rows = dataTable.rows().data().toArray()
    let dataArray = []

    for (let i = 0; i < rows.length; i++) {
      dataArray.push({id: rows[i][0],firstname: rows[i][1].toLowerCase(), lastname:rows[i][2].toLowerCase()})
    }
    return dataArray;
}

function generateNewArrayFromExpectedId(id, datas){
    let newArray = []
    $.each(datas, (index,data)=>{
        if(id != data.id){
            newArray.push({id: data.id, firstname: data.firstname, lastname:data.lastname})
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

function fadeGlobalAlertMsg(){
    if($(".alert-wrapper.global-error").hasClass("not_collapse") && $(".globalerror-container").hasClass("show")){
        $(".not_collapse").parent().removeClass("m-b-0")
        $(".alert-wrapper.global-error").removeClass("not_collapse")
        $(".globalerror-container").removeClass("show")
    }
}

function clearInputForm(){
    let inputs = $("input")
    for(let i=0; i<inputs.length; i++){
        inputs[i].value = ""
    }
}



