import com.cadu.erp.vendas.model.NotaFiscal;
import com.cadu.erp.vendas.model.Venda;
import com.cadu.erp.vendas.repository.NotaFiscalRepository;
import com.cadu.erp.vendas.service.NotaFiscalService;
import com.cadu.erp.vendas.service.VendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notas-fiscais")
public class NotaFiscalController {

    private final NotaFiscalRepository notaFiscalRepository;
    private final NotaFiscalService notaFiscalService;
    private final VendaService vendaService;

    public NotaFiscalController(NotaFiscalRepository notaFiscalRepository, NotaFiscalService notaFiscalService, VendaService vendaService) {
        this.notaFiscalRepository = notaFiscalRepository;
        this.notaFiscalService = notaFiscalService;
        this.vendaService = vendaService;
    }

    @GetMapping
    public List<NotaFiscal> listar() {
        return notaFiscalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaFiscal> buscarPorId(@PathVariable UUID id) {
        return notaFiscalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/venda/{vendaId}")
    public ResponseEntity<NotaFiscal> buscarPorVendaId(@PathVariable UUID vendaId) {
        return notaFiscalRepository.findByVendaId(vendaId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/emitir/{vendaId}")
    public ResponseEntity<NotaFiscal> emitirNotaFiscal(@PathVariable UUID vendaId) {
        Venda venda = vendaService.buscarVendaEntityPorId(vendaId);
        NotaFiscal notaFiscal = notaFiscalService.emitirNotaFiscal(venda);
        return ResponseEntity.ok(notaFiscal);
    }
}
