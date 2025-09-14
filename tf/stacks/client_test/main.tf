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
  name            = "vm-disk-test"
  base_volume_id  = libvirt_volume.image.id
  pool            = "default"
  size            = var.disk_size // in bytes
}

data "template_file" "user_data" {
  template = file("${path.module}/config/cloud_init.cfg")
}

data "template_file" "network_config" {
  template = file("${path.module}/network/network_config.cfg")
}

resource "libvirt_cloudinit_disk" "commoninit" {
  name           = "${var.iso_name}.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  //pool           = libvirt_pool.ubuntu.name
}

# Create the machine
resource "libvirt_domain" "domain" { // must be unique -> VM NAME
  name   = "${var.client_name}-${var.image_name}-${var.domain_num}"
  memory = var.memory
  vcpu   = var.vcpu

  cloudinit = libvirt_cloudinit_disk.commoninit.id

  network_interface {
    network_name = var.net_mode
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
    volume_id = libvirt_volume.image.id
  }

  graphics {
    type        = "spice"
    listen_type = "address"
    autoport    = true
  }
}