package com.ui.UI_frontOffice.servlet;

import com.core_backOffice.core.beans.Salle;
import com.core_backOffice.core.service.salleService;
import com.core_backOffice.core.service.occService;
import com.core_backOffice.core.service.profService;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "SalleServlet", value = "/Salle")
public class SalleServlet extends HttpServlet {
    private final salleService salleServie;
    private final occService occService;
    private final profService profService;


    public SalleServlet() {
        this.salleServie = new salleService();
        this.profService = new profService();
        this.occService = new occService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        List<Salle> Salles = salleServie.getlistSalle();
        Long _totalProf = profService.getTotalProf();
        Long _totalSalle = salleServie.gettotalSalle();
        Long _totalOcc = occService.getTotalOcc();

        request.setAttribute("salles", Salles);
        request.setAttribute("totalProf", _totalProf);
        request.setAttribute("totalSalle", _totalSalle);
        request.setAttribute("totalOcc", _totalOcc);
        request.setAttribute("salle_link_active", true);
        this.getServletContext().getRequestDispatcher("/views/salle_front_view.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if(request.getParameter("RequestType").equals("AddSalle")){
            processAddSalle(request, response);
        }else if(request.getParameter("RequestType").equals("GetLastInsertSalle")){
            processGetLastInsertSalle(request, response);
        }else if(request.getParameter("RequestType").equals("getSalleById")){
            processGetSalle(request, response);
        }else if(request.getParameter("RequestType").equals("UpdateSalle")){
            processUpdateSalle(request, response);
        }else if(request.getParameter("RequestType").equals("DeleteSalle")){
            processDeleteSalle(request, response);
        }else if(request.getParameter("RequestType").equals("getAllSalles")){
            processGetAllSalles(request, response);
        }else if(request.getParameter("RequestType").equals("getTotalSalle")){
            processGetTotalSalle(request, response);
        }
    }

    protected void processAddSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        salleServie.createSalle(request.getParameter("designation"));

        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 201);
        dataResponse.put("sucessMsg", "Salle ajouté avec succès!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }
    protected void processGetLastInsertSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Salle> salle = salleServie.getlastsalle();

        String JsonResponse = new Gson().toJson(salle);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processGetSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Salle> salle = salleServie.getSalle(Long.valueOf(request.getParameter("Id_Salle")));
        String JsonResponse = new Gson().toJson(salle);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }

    protected void processUpdateSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        salleServie.updateSalle(Long.valueOf(request.getParameter("Id_Salle")), request.getParameter("newDesignation"));

        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 200);
        dataResponse.put("sucessMsg", "Salle modifiée avec succès!");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);

        String JsonResponse = new Gson().toJson(_dataResponse);

        System.out.println(JsonResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }

    protected void processDeleteSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        salleServie.deleteSalle(Long.valueOf(request.getParameter("Id_Salle")));
        Map dataResponse = new HashMap();

        dataResponse.put("requestStatusCode", 204);
        dataResponse.put("sucessMsg", "La salle a rétirée de la base de données");

        ArrayList _dataResponse = new ArrayList();

        _dataResponse.add(dataResponse);


        String JsonResponse = new Gson().toJson(_dataResponse);

        response.setContentType("application/json");
        response.getWriter().write(JsonResponse);
    }
    protected void processGetAllSalles(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        List<Salle> salles = salleServie.getlistSalle();
        String JsonResponse = new Gson().toJson(salles);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }
    protected void processGetTotalSalle(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        Map dataResponse = new HashMap();
        dataResponse.put("TotalSalle", salleServie.gettotalSalle());

        String JsonResponse = new Gson().toJson(dataResponse);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(JsonResponse);
    }
}
