package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Permite o acesso de qualquer origem
@RestController
@RequestMapping("/api")
public class MHMovieController {

    @Autowired
    private MHMovieService service;
    
    // Endpoint POST para criar uma nova reserva
    @PostMapping("/CriarReserva")
    public ResponseEntity<MHMovieReserva> criarReserva(@RequestBody MHMovieReserva reserva) {
        try {
            MHMovieReserva savedReserva = service.salvar(reserva);
            return new ResponseEntity<>(savedReserva, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log da exceção
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint GET para listar todas as reservas
    @GetMapping("/mostrarReserva")
    public List<MHMovieReserva> listarReservas() {
        return service.listarTodos();
    }
    
    @GetMapping("/buscarReservaId/{id}")
    public ResponseEntity<MHMovieReserva> buscarPorId(@PathVariable Long id) {
        MHMovieReserva reserva = service.buscarPorId(id);
        return reserva != null ? ResponseEntity.ok(reserva) : ResponseEntity.notFound().build();
    }

    // Endpoint PUT para atualizar uma reserva existente
    @PutMapping("/atualizarReserva/{id}")
    public ResponseEntity<MHMovieReserva> atualizarReserva(@PathVariable Long id, @RequestBody MHMovieReserva reserva) {
        MHMovieReserva updatedReserva = service.atualizar(id, reserva);
        return updatedReserva != null ? ResponseEntity.ok(updatedReserva) : ResponseEntity.notFound().build();
    }

    // Endpoint DELETE para excluir uma reserva
    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<Void> excluirReserva(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
