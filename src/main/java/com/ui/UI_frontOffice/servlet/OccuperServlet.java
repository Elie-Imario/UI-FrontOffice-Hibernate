package com.ui.UI_frontOffice.servlet;

import com.core_backOffice.core.beans.Occuper;
import com.core_backOffice.core.service.occService;
import com.core_backOffice.core.service.profService;
import com.core_backOffice.core.service.salleService;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "OccuperServlet", value = "/Occuper")
public class OccuperServlet extends HttpServlet {
    private final occService occService;
    private final profService profService;
    private final salleService salleService;

    public OccuperServlet() {
        this.occService = new occService();
        this.profService = new profService();
        this.salleService = new salleService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Object[]> Reservations = (List<Object[]>)occService.getlistOcc();
        Long _totalProf = profService.getTotalProf();
        Long _totalSalle = salleService.gettotalSalle();
        Long _totalOcc = occService.getTotalOcc();

        request.setAttribute("reservations", Reservations);
        request.setAttribute("totalProf", _totalProf);
        request.setAttribute("totalSalle", _totalSalle);
        request.setAttribute("totalOcc", _totalOcc);
        request.setAttribute("occuper_link_active", true);
        this.getServletContext().getRequestDispatcher("/views/occuper_front_view.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if(request.getParameter("RequestType").equals("OccuperSalle")){
            processReserverSalle(request, response);
        }else if(request.getParameter("RequestType").equals("GetLastInsertBooking")){
            processGetLastInsertOcc(request, response);
        }else if(request.getParameter("RequestType").equals("getOccById")){
            processGetOcc(request, response);
        }else if(request.getParameter("RequestType").equals("UpdateOcc")){
            processUpdateOcc(request, response);
        }else if(request.getParameter("RequestType").equals("DeleteOcc")){
            processDeleteOcc(request, response);
        }else if(request.getParameter("RequestType").equals("getTotalOcc")){
            processGetTotalOcc(request, response);
        }

    }

    protected void processReserverSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        occService.occuperUneSalle(Long.valueOf(request.getParameter("IdProf")), Long.valueOf(request.getParameter("IdSalle")), occService.GetFormattedDate(request.getParameter("date_Occ")));
        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 201);
        dataResponse.put("sucessMsg", "La Salle "+ occService.getSalleRepository().getbyId(Long.valueOf(request.getParameter("IdSalle"))).getDesignation()+
                " sera occupée par le professeur "+occService.getProfRepository().getbyId(Long.valueOf(request.getParameter("IdProf"))).getNom()+
                " "+occService.getProfRepository().getbyId(Long.valueOf(request.getParameter("IdProf"))).getPrenom());

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }
    protected void processGetLastInsertOcc(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Object[]> Reservation = (List<Object[]>)occService.getocclastinsert();
        String JsonResponse = new Gson().toJson(Reservation);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetOcc(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Object[]> Reservation = (List<Object[]>)occService.findOccById(Long.valueOf(request.getParameter("Id_R")));
        String JsonResponse = new Gson().toJson(Reservation);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processUpdateOcc(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        occService.updateReservation(Long.valueOf(request.getParameter("Id_R")), Long.valueOf(request.getParameter("newId_Salle")), occService.GetFormattedDate(request.getParameter("newDateOcc")));
        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 200);
        dataResponse.put("sucessMsg", "La reservation a été modifié avec succès!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        System.out.println(JsonResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }

    protected void processDeleteOcc(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        occService.removeocc(Long.valueOf(request.getParameter("Id_R")));
        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 204);
        dataResponse.put("sucessMsg", "La reservation pour la salle a été retirée!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);


        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetTotalOcc(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        Map dataResponse = new HashMap();
        dataResponse.put("TotalOcc", occService.getTotalOcc());

        String JsonResponse = new Gson().toJson(dataResponse);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

}
