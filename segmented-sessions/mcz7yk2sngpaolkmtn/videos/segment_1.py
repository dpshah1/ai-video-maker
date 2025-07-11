from manim import *

class EulerKönigsberg(Scene):
    def construct(self):

        title = Text("Euler, Königsberg, and the Elegance of Graphs", font_size=36)
        subtitle = Text("Connecting Networks, Maps, and More!", font_size=24)

        title.move_to(UP * 1)
        subtitle.next_to(title, DOWN)

        rectangle = Rectangle(width=title.width + 0.5, height=title.height + 0.5, color=BLUE)
        rectangle.move_to(title.get_center())

        self.play(Create(rectangle))
        self.play(Write(title))
        self.play(Write(subtitle))

        self.wait(6.4)