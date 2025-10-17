terraform {
  required_providers {
    libvirt = {
      source  = "dmacvicar/libvirt"
      version = "0.7.1" # Vérifiez la version souhaitée
    }
  }
}
provider "libvirt" {
  alias = "local"
  uri = "qemu:///system"
  //uri   = "qemu+ssh://cross@192.168.1.177/system"
}

resource "libvirt_volume" "image" {
  name = "${var.image_name}-volume.qcow2"
  pool = "default"
  source = var.image
  format = "qcow2"
}

resource "libvirt_volume" "disk" {
  name            = "disk-${var.client_name}-${var.image_name}-${var.domain_num}"
  base_volume_id  = libvirt_volume.image.id
  pool            = "default"
  size            = var.disk_size // in bytes
}

data "template_file" "user_data" {
  template = file("${path.module}/cloud_init.yml")
}

data "template_file" "network_config" {
  template = file("${path.module}/network_config.yml")
}

resource "libvirt_cloudinit_disk" "commoninit" {
  name           = "${var.client_name}-${var.image_name}-${var.domain_num}.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  //pool           = libvirt_pool.ubuntu.name
}


# Si réseau NAT à créer
resource "libvirt_network" "nat_network" {
  count     = var.network_mode == "nat" ? 1 : 0
  name      = "net-${var.iso_name}-nat" # TODO : nom unique !
  mode      = "nat"
  addresses = ["192.168.${100 + count.index}.0/24"] # TODO : Plage d'adresse unique !

  dhcp {
    enabled = true
  }

  autostart = true
}

# Si réseau isolé à créer
resource "libvirt_network" "isolated_network" {
  count     = var.network_mode == "isolated" ? 1 : 0
  name      = "net-${var.iso_name}-isolated" # TODO : nom unique !
  mode      = "isolated"
  addresses = ["10.${100 + count.index}.0.0/24"]  # TODO : Plage d'adresse unique !


  dhcp {
    enabled = true
  }

  autostart = true
}


# Create the machine
resource "libvirt_domain" "domain" { // must be unique -> VM NAME
  name   = "${var.client_name}-${var.image_name}-${var.domain_num}"
  memory = var.memory
  vcpu   = var.vcpu

  cloudinit = libvirt_cloudinit_disk.commoninit.id

  qemu_agent = true

network_interface {
    network_name = (
      var.network_mode == "default" ? "default" :
      var.network_mode == "bridge" ? "br0" : # bridge impossible sur interface wireless .....
      var.network_mode == "nat" ? libvirt_network.nat_network[0].name :
      var.network_mode == "isolated" ? libvirt_network.isolated_network[0].name :
      "default"
    )
    wait_for_lease = true
  }

  # IMPORTANT: this is a known bug on cloud images, since they expect a console
  # we need to pass it
  # https://bugs.launchpad.net/cloud-images/+bug/1573095
  console {
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }

  console {
    type        = "pty"
    target_type = "virtio"
    target_port = "1"
  }

  disk {
    volume_id = libvirt_volume.disk.id // replaced image by disk
  }

  graphics {
    type        = "spice"
    listen_type = "address"
    autoport    = true
  }
}

output "vm_ip" {
  value = libvirt_domain.domain.network_interface[0].addresses
}
