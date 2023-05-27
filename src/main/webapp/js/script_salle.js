$(document).ready(function(){
    $(".tablelisteSalle").dataTable({
        "aaSorting": [[0, 'desc']],
        "sPaginationType": "full_numbers",
        "oLanguage": {
            "sUrl": "vendor/DataTables/dt-config-fr.txt"
        },
        "bDestroy": true
    })

    $('.btn-add').on('click', function(){
        showModal(".container-input100.addModalPopUp")
    })

    $('#cancel_add_salle').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-add-popup').on('click', function(){
        closeModal(".container-input100.addModalPopUp")
    })

    $('.close-edit-popup').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    $('#cancel_edit_salle').on('click', function () {
        closeModal(".container-input100.editModalPopUp")
    })

    /*****************************
     * CRUD OPERATION
     */
    $('#confirm_add_salle').on('click', function () {
        let designation_input = $("input[name='DesignationToAdd']")
        addSalle(designation_input)
    })

    $('#confirm_edit_salle').on('click', function () {
        let newdesignation_input = $("input[name='DesignationToEdit']")
        updateSalle(newdesignation_input)
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
                    let inputs = $("input")
                    for(let i=0; i<inputs.length; i++){
                        inputs[i].value = ""
                    }
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
                    console.log(row)
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


