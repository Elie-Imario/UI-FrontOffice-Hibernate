<%@ include file="../components/header.jsp"%>
<body>
    <!-- Sidebar -->
        <%@ include file="../components/sidebar.jsp"%>
    <!--  -->
    <!-- MainPannel -->
        <div class="main-side">
            <!-- main-side-header -->
            <div class="card-detail-container m-t-40 limiter">
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-users"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Effectif Prof</span>
                        <div class="stat-section m-t-15">
                            <span id="totalProf"><c:out value="${totalProf}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail active">
                    <div class="ico-card"><span><i class="fa fa-house-circle-check"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Total Salle</span>
                        <div class="stat-section m-t-15">
                            <span id="totalSalle"><c:out value="${totalSalle}"></c:out></span>
                        </div>
                    </div>
                </div>
                <div class="card-detail">
                    <div class="ico-card"><span><i class="fa fa-house-lock"></i></span></div>
                    <div class="card-content">
                        <span class="card-title-lead m-t-10">Salle Occupée</span>
                        <div class="stat-section m-t-15">
                            <span id="totalOcc"><c:out value="${totalOcc}"></c:out></span>
                        </div>
                    </div>
                </div>
            </div>
            <!--  -->

            <!---->
            <!-- Alert Section -->
            <div class="alert-container">
                <div class="alert-success">
                    <div class="ico-alert"><span class="shake"><i class="bi bi-bell"></i></span></div>
                    <div class="alert-success-content">
                        <span class="close-btn"><i class="fa fa-times-circle"></i></span>
                        <span class="alertmsg"></span>
                    </div>
                </div>
            </div>
            <!---->
            <!--  -->

            <!-- Tab -->
            <div class="tab-list-container m-t-60 limiter">
                <div class="tablist-section">
                    <div class="tab-header-section">
                        <h3 class="table-header-title-lead ">LISTE DES SALLES</h3>
                        <button class="btn-add primary-btn" id="addSalle" type="button"
                                title="Ajouer une salle">
                            <i class="bi bi-house-door m-r-5"></i>
                            Ajouter
                        </button>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered table-condensed tablelisteSalle">
                        <thead>
                            <tr>
                                <th>CodeSal</th>
                                <th>Designation</th>
                                <th class="no-sorting"></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">
                            <c:forEach items="${salles}" var="salle">
                            <tr id="row<c:out value="${salle.id_Salle}"></c:out>">
                                <td>S-<c:out value="${salle.id_Salle}"></c:out></td>
                                <td><c:out value="${salle.designation}"></c:out></td>
                                <td>
                                    <div class="options">
                                        <button type="button" class="option-btn-item" onclick='initUpdateSalle(<c:out value="${salle.id_Salle}"/>)'><i class="fa fa-edit"></i></button>
                                        <button type="button" class="option-btn-item" onclick='deleteSalle(<c:out value="${salle.id_Salle}"/>)'><i class="fa fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            </c:forEach>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!--  -->
            
            <!-- Add-form-popup -->
            <div class="modal-limiter">
                <div class="overlay"></div>
                <div class="container-input100 addModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-add-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title">
                                Ajouter une Salle
                            </span>
                        </div>
                        <div class="add-salle-form m-t-30">
                            <div class="wrap-input100">
                                <label for="input100-designation">Designation</label>
                                <input type="text" class="input100 m-t-10" id="input100-designation" placeholder="....." name="DesignationToAdd">
                                <div class="alert-wrapper">
                                    <div class="error">
                                        <i class="fa fa-exclamation-circle"></i>
                                        <span class="error-msg"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_add_salle" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_add_salle">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>                    
                </div>

                <!-- edit-form-popup -->
                <div class="container-input100 editModalPopUp hide">
                    <div class="wrap-form100">
                        <div class="modal-header">
                            <button class="closepopup close-edit-popup"><i class="fa fa-times"></i></button>
                            <span class="modal-header-title" id="editModalPopUp-header">

                            </span>
                        </div>
                        <div class="add-salle-form m-t-30">
                            <input type="hidden" name="IdSalle">
                            <div class="wrap-input100">
                                <label for="input100-designation_">Designation</label>
                                <input type="text" class="input100 m-t-10" id="input100-designation_" placeholder="....."  name="DesignationToEdit">
                                <div class="alert-wrapper">
                                    <div class="error">
                                        <i class="fa fa-exclamation-circle"></i>
                                        <span class="error-msg"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="button_group m-t-30">
                                <button class="btn-form primary-btn" id="confirm_edit_salle" type="button">
                                    <i class="fa fa-save"></i>
                                    Confirmer
                                </button>
                                <button type="reset" class="btn-form secondary-btn" id="cancel_edit_salle">
                                    <i class="fa fa-times"></i>
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    <!--  -->
    <script src="js/script_salle.js"></script>
</body>
</html>