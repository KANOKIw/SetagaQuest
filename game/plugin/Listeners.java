package si.f5.mitminecraft.sushida;

import org.bukkit.Material;
import org.bukkit.entity.Creeper;
import org.bukkit.entity.Enderman;
import org.bukkit.entity.Entity;
import org.bukkit.entity.EntityType;
import org.bukkit.entity.Guardian;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockPhysicsEvent;
import org.bukkit.event.entity.EntityExplodeEvent;
import org.bukkit.event.entity.EntityTargetEvent;
import org.bukkit.event.entity.EntityTeleportEvent;
import org.bukkit.event.player.PlayerInteractEntityEvent;
import org.bukkit.event.vehicle.VehicleExitEvent;

public class Listeners implements Listener{
    Listeners(){

    }

    @EventHandler
    public void onEndermanTeleport(EntityTeleportEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Enderman && entity.getLocation().getY() > 0){
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityDismount(VehicleExitEvent event){
        Entity exitedEntity = event.getExited();
        if (exitedEntity.getType() == EntityType.ENDERMAN){
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onEntityExplode(EntityExplodeEvent event){
        Entity entity = event.getEntity();
        if (entity instanceof Creeper && ((Creeper) entity).isPowered()) {
            event.setCancelled(true);
        }
    }


    @EventHandler
    public void onPlayerInteractEntity(PlayerInteractEntityEvent event){
        Entity entity = event.getRightClicked();
        Player player = event.getPlayer();
        if (entity instanceof Creeper && ((Creeper) entity).isInvulnerable()){
            if (player.getInventory().getItemInMainHand().getType() == Material.FLINT_AND_STEEL){
                event.setCancelled(true);
            }
        }
    }


    @EventHandler
    public void onBlockPhysics(BlockPhysicsEvent event) {
        if (event.getBlock().getType().name().contains("FALLING_BLOCK")) {
            event.setCancelled(true);
        }
    }
}
